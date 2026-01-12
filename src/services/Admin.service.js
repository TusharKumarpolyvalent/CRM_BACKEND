const prisma = require('../config/prisma');

module.exports.createCampaign = async (campaignData) => {
  return await prisma.Campaign.create({
    data: campaignData,
  });
};

module.exports.fetchAllCampaigns = async () => {
  return await prisma.Campaign.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });
};

module.exports.createLeads = async (leadData) => {
  return await prisma.Leads.create({
    data: leadData,
  });
};

module.exports.fetchCampaignLeads = async (
  id,
  assigned,
  date,
  fromDate,
  toDate
) => {
  console.log('📥 fetchCampaignLeads called with:', {
    id,
    assigned,
    date,
    fromDate,
    toDate,
  });

  const where = {
    campaign_id: id,
  };

  // 🔥 ASSIGNED FILTER
  if (assigned === 'true') {
    where.assigned_to = { not: null };
    console.log('👤 Applied assigned filter: true');
  } else if (assigned === 'false') {
    where.assigned_to = null;
    console.log('👤 Applied assigned filter: false');
  } else if (assigned === 'all') {
    console.log('👤 Applied assigned filter: all (no filter)');
  }
  // Default - unassigned
  else if (!assigned) {
    where.assigned_to = null;
    console.log('👤 Default filter: unassigned');
  }

  // 🔥 DATE FILTERS - IMPORTANT FIX!
  // एक ही time में केवल एक date filter apply होना चाहिए
  if (date) {
    // Single date filter (for Today button)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.created_at = {
      gte: start,
      lte: end,
    };

    console.log('📅 Applied single date filter:', date);
  } else if (fromDate && toDate) {
    // Date range filter (for From-To)
    const start = new Date(fromDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(toDate);
    end.setHours(23, 59, 59, 999);

    where.created_at = {
      gte: start,
      lte: end,
    };

    console.log('📅 Applied date range filter:', fromDate, 'to', toDate);
  }
  // अगर कोई date filter नहीं है, तो सभी dates के leads return करें
  else {
    console.log('📅 No date filter applied');
  }

  console.log('🔍 Final Prisma where clause:', JSON.stringify(where, null, 2));

  const result = await prisma.Leads.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });

  console.log(`✅ Found ${result.length} leads`);
  return result;
};

module.exports.createUser = async (userData) => {
  return await prisma.Users.create({
    data: userData,
  });
};

module.exports.fetchAllUsers = async (role) => {
  if (role === 'all') {
    return await prisma.Users.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  } else
    return await prisma.Users.findMany({
      where: { role: role },
      orderBy: {
        created_at: 'desc',
      },
    });
};

module.exports.giveAgentToLeads = async (leadIds, agentId) => {
  return prisma.Leads.updateMany({
    where: {
      id: {
        in: leadIds,
      },
    },
    data: {
      assigned_to: agentId,
    },
  });
};

module.exports.deleteCampaignService = async (id) => {
  // delete all leads under this campaign first
  await prisma.Leads.deleteMany({ where: { campaign_id: id } });

  // then delete the campaign
  return await prisma.Campaign.delete({ where: { id } });
};

//
module.exports.updateCheckedClientLead = async (id, checkedclientlead) => {
  return prisma.Leads.update({
    where: { id: Number(id) },
    data: {
      checkedclientlead: Boolean(checkedclientlead),
    },
  });
};
// Admin.service.js में नीचे updateCheckedClientLead के बाद add करें

module.exports.updateReassignService = async (leadIds, reassignData) => {
  return await prisma.Leads.updateMany({
    where: {
      id: {
        in: leadIds,
      },
    },
    data: {
      reassign: reassignData,
      updated_at: new Date(),
    },
  });
};

module.exports.clearReassignService = async (leadId) => {
  return await prisma.Leads.update({
    where: { id: Number(leadId) },
    data: {
      reassign: null,
      updated_at: new Date(),
    },
  });
};

// giveAgentToLeads function को update करें
// Admin.service.js में giveAgentToLeads function update करें:

module.exports.giveAgentToLeads = async (leadIds, agentId) => {
  console.log('🔧 giveAgentToLeads FIXED called with:', {
    leadIds,
    agentId,
  });

  // 1️⃣ Fetch existing leads
  const existingLeads = await prisma.Leads.findMany({
    where: {
      id: { in: leadIds },
    },
    select: {
      id: true,
      assigned_to: true,
    },
  });

  // 2️⃣ Get agent name (only once)
  const agent = await prisma.Users.findUnique({
    where: { id: agentId },
    select: { name: true },
  });

  const updates = existingLeads.map((lead) => {
    // ✅ FIRST TIME ASSIGN → reassign = null
    if (!lead.assigned_to) {
      return prisma.Leads.update({
        where: { id: lead.id },
        data: {
          assigned_to: agentId,
          reassign: null,
          updated_at: new Date(),
        },
      });
    }

    // ✅ SAME AGENT → no reassign
    if (lead.assigned_to === agentId) {
      return prisma.Leads.update({
        where: { id: lead.id },
        data: {
          assigned_to: agentId,
          reassign: null,
          updated_at: new Date(),
        },
      });
    }

    // 🔁 REAL REASSIGN (agent changed)
    return prisma.Leads.update({
      where: { id: lead.id },
      data: {
        assigned_to: agentId,
        reassign: JSON.stringify({
          agentId,
          agentName: agent?.name || 'Unknown',
        }),
        updated_at: new Date(),
      },
    });
  });

  const result = await Promise.all(updates);

  console.log(`✅ Successfully processed ${result.length} leads`);
  return result;
};
