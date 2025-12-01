const prisma = require('../config/prisma');

module.exports.fetchLeads = async (id) => {
  return prisma.leads.findMany({
    where: { assigned_to: id },
  });
};
