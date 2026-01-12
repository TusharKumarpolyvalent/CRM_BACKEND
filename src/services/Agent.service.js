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
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Update Leads table (attempts UNLIMITED)
    const updatedLead = await tx.Leads.update({
      where: { id },
      data: {
        status,
        remarks: remark,
        attempts: attempt,
        last_call: lastcall,
        doc_status: docStatus,
        reason,
      },
    });

    // 2️⃣ Update Leadrecord (LATEST 3 ONLY)
    const existingRecord = await tx.Leadrecord.findUnique({
      where: { id: id.toString() },
    });

    if (existingRecord) {
      await tx.Leadrecord.update({
        where: { id: id.toString() },
        data: {
          status3: existingRecord.status2,
          remark3: existingRecord.remark2,

          status2: existingRecord.status1,
          remark2: existingRecord.remark1,

          status1: status,
          remark1: remark,
        },
      });
    } else {
      await tx.Leadrecord.create({
        data: {
          id: id.toString(),
          status1: status,
          remark1: remark,
        },
      });
    }

    return updatedLead;
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
// Agent.service.js में नीचे add करें:

module.exports.updateLeads = async (leadId, data) => {
  try {
    console.log('updateLeads service called:', { leadId, data });

    return await prisma.$transaction(async (tx) => {
      // Update Leads table
      const updateData = {
        status: data.status,
        remarks: data.remarks || data.remark,
        reason: data.reason,
        last_call: new Date(),
      };

      // Add followup_at if provided
      if (data.followupAt) {
        updateData.followup_at = new Date(data.followupAt);
      }

      // Increment attempts
      const currentLead = await tx.Leads.findUnique({
        where: { id: leadId },
      });

      if (currentLead) {
        updateData.attempts = (
          parseInt(currentLead.attempts || '0') + 1
        ).toString();
      }

      const updatedLead = await tx.Leads.update({
        where: { id: leadId },
        data: updateData,
      });

      // Update Leadrecord (latest 3 records logic)
      const existingRecord = await tx.Leadrecord.findUnique({
        where: { id: leadId.toString() },
      });

      if (existingRecord) {
        await tx.Leadrecord.update({
          where: { id: leadId.toString() },
          data: {
            status3: existingRecord.status2,
            remark3: existingRecord.remark2,

            status2: existingRecord.status1,
            remark2: existingRecord.remark1,

            status1: data.status,
            remark1: data.remarks || data.remark,
          },
        });
      } else {
        await tx.Leadrecord.create({
          data: {
            id: leadId.toString(),
            status1: data.status,
            remark1: data.remarks || data.remark,
          },
        });
      }

      return updatedLead;
    });
  } catch (error) {
    console.error('Error in updateLeads service:', error);
    throw error;
  }
};
