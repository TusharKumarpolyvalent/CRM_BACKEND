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

module.exports.fetchCampaignLeads = async (id, assigned) => {
  if (assigned === 'true') {
    return await prisma.Leads.findMany({
      where: {
        campaign_id: id,
        assigned_to: {
          not: null,
        },
      },
      orderBy: { created_at: 'desc' },
    });
  } else if (assigned === 'false')
    return await prisma.Leads.findMany({
      where: {
        campaign_id: id,
        assigned_to: null,
      },
      orderBy: { created_at: 'desc' },
    });
  else
    return await prisma.Leads.findMany({
      where: {
        campaign_id: id,
      },
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
