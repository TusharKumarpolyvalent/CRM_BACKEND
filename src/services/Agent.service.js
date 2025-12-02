const prisma = require('../config/prisma');

module.exports.fetchLeads = async (id) => {
  return prisma.leads.findMany({
    where: { assigned_to: id },
  });
};

module.exports.fetchLead = async (id) => {
  return prisma.leads.findUnique({
    where: { id: id },
  });
};

module.exports.updateLead = async (
  id,
  { status, remark, lastcall, attempt }
) => {
  return prisma.leads.update({
    where: { id: id },
    data: {
      status: status,
      remarks: remark,
      attempts: attempt,
      last_call: lastcall,
    },
  });
};
