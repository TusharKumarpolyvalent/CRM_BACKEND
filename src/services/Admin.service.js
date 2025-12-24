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
  const where = {
    campaign_id: id,
  };

  // 🔥 ASSIGNED FILTER
  if (assigned === 'true') {
    where.assigned_to = { not: null };
  } else if (assigned === 'false') {
    where.assigned_to = null;
  }

  // 🔥 DATE FILTERS
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.created_at = {
      gte: start,
      lte: end,
    };
  }

  if (fromDate && toDate) {
    where.created_at = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  return await prisma.Leads.findMany({
    where,
    orderBy: { created_at: 'desc' },
  });
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

//
