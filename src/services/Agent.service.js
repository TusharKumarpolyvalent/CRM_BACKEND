const prisma = require('../config/prisma');

module.exports.fetchRecordWithId = async (table, id) => {
  return prisma[table].findUnique({
    where: { id: id },
  });
};
module.exports.fetchLeads = async (id) => {
  return prisma.Leads.findMany({
    where: { assigned_to: id },
    orderBy: { created_at: 'desc' },
  });
};

module.exports.updateLead = async (
  id,
  { status, remark, lastcall, attempt, docStatus, reason }
) => {
  return prisma.Leads.update({
    where: { id: id },
    data: {
      status: status,
      remarks: remark,
      attempts: attempt,
      last_call: lastcall,
      doc_status: docStatus,
      reason: reason,
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
