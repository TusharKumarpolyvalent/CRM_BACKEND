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

  if (date) {
    // Single date filter (for Today button)
    // Parse YYYY-MM-DD as local date to avoid timezone shift (off-by-one)
    const [sy, sm, sd] = date.split('-').map((v) => Number(v));
    const start = new Date(sy, sm - 1, sd);
    start.setHours(0, 0, 0, 0);

    const end = new Date(sy, sm - 1, sd);
    end.setHours(23, 59, 59, 999);

    where.created_at = {
      gte: start,
      lte: end,
    };

    console.log('📅 Applied single date filter (local):', date);
  } else if (fromDate && toDate) {
    // Date range filter (for From-To)
    // Parse both dates as local dates
    const [fy, fm, fd] = fromDate.split('-').map((v) => Number(v));
    const [ty, tm, td] = toDate.split('-').map((v) => Number(v));

    const start = new Date(fy, fm - 1, fd);
    start.setHours(0, 0, 0, 0);

    const end = new Date(ty, tm - 1, td);
    end.setHours(23, 59, 59, 999);

    where.created_at = {
      gte: start,
      lte: end,
    };

    console.log(
      '📅 Applied date range filter (local):',
      fromDate,
      'to',
      toDate
    );
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

// module.exports.giveAgentToLeads = async (leadIds, agentId) => {
//   return prisma.Leads.updateMany({
//     where: {
//       id: {
//         in: leadIds,
//       },
//     },
//     data: {
//       assigned_to: agentId,
//     },
//   });
// };

module.exports.deleteCampaignService = async (id) => {
  try {
    const campaignId = id.trim(); // ✅ Trim spaces

    // 1️⃣ Check if campaign exists
    const campaign = await prisma.Campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      const error = new Error('Campaign not found');
      error.code = 'P2025';
      throw error;
    }

    // 2️⃣ Find all leads under this campaign
    const leads = await prisma.Leads.findMany({
      where: { campaign_id: campaignId },
      select: { id: true },
    });

    const leadIds = leads.map((l) => l.id);

    // 3️⃣ Delete all call logs for these leads
    if (leadIds.length > 0) {
      await prisma.callLog.deleteMany({
        where: { lead_id: { in: leadIds } },
      });
    }

    // 4️⃣ Delete all leads
    await prisma.Leads.deleteMany({ where: { campaign_id: campaignId } });

    // 5️⃣ Delete the campaign
    const deletedCampaign = await prisma.Campaign.delete({
      where: { id: campaignId },
    });

    return deletedCampaign;
  } catch (error) {
    console.error('❌ deleteCampaignService error:', error);
    throw error;
  }
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
  const leads = await prisma.Leads.findMany({
    where: { id: { in: leadIds } },
    select: { id: true, assigned_to: true },
  });

  const agent = await prisma.Users.findUnique({
    where: { id: agentId },
    select: { name: true },
  });

  const updates = leads.map((lead) => {
    const isFirstAssign = !lead.assigned_to;
    const isSameAgent = lead.assigned_to === agentId;

    return prisma.Leads.update({
      where: { id: lead.id },
      data: {
        assigned_to: agentId,
        reassign: isFirstAssign
          ? null // ✅ first time assign → no reassign
          : JSON.stringify({
              previousAgentId: lead.assigned_to,
              currentAgentId: agentId,
              currentAgentName: agent?.name || 'Unknown',
              sameAgent: isSameAgent,
              action: 'ASSIGN',
              timestamp: new Date().toISOString(),
            }),
        updated_at: new Date(),
      },
    });
  });

  return Promise.all(updates);
};
