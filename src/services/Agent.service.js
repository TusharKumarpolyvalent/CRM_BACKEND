const prisma = require('../config/prisma');

module.exports.fetchRecordWithId = async (table, id) => {
  return prisma[table].findUnique({
    where: { id: id },
  });
};
module.exports.fetchLeads = async (id) => {
  return prisma.leads.findMany({
    where: { assigned_to: id },
  });
};

module.exports.updateLead = async (
  id,
  { status, remark, lastcall, attempt, docStatus }
) => {
  return prisma.leads.update({
    where: { id: id },
    data: {
      status: status,
      remarks: remark,
      attempts: attempt,
      last_call: lastcall,
      doc_status: docStatus,
    },
  });
};

module.exports.updateLeadRecord = async (id, data) => {
  return prisma.LeadRecord.update({
    where: { id: id },
    data: data,
  });
};

module.exports.createLeadRecord = async (data) => {
  return prisma.LeadRecord.create({
    data: data,
  });
};
