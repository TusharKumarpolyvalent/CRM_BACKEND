const prisma = require('../config/prisma');

module.exports.createCampaign = async (campaignData) => {
  return await prisma.Campaign.create({
    data: campaignData,
  });
};
