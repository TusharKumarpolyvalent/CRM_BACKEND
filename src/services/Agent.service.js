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
        attempts: { increment: 1 },

        last_call: lastcall,
        doc_status: docStatus,
        reason,
      },
    });
    await tx.callLog.create({
      data: {
        lead_id: id,
        agent_id: updatedLead.assigned_to,
        called_at: new Date(),
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
module.exports.updateLeadAddress = async (leadId, data) => {
  return prisma.Leads.update({
    where: { id: leadId },
    data: {
      ...(data.city && { city: data.city }),
      ...(data.pincode && { pincode: data.pincode }),
    },
  });
};

module.exports.updateLeadrecord = async (id, data) => {
  return prisma.LeadRecord.update({
    where: { id: id },
    data: data,
  });
};

module.exports.createLeadrecord = async (data) => {
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
      if (data.city) updateData.city = data.city;
      if (data.pincode) updateData.pincode = data.pincode;
      if (data.name) updateData.name = data.name;

      // Add followup_at if provided
      if (data.followupAt) {
        updateData.followup_at = new Date(data.followupAt);
      }

      // Increment attempts
      const currentLead = await tx.Leads.findUnique({
        where: { id: leadId },
      });

      if (currentLead) {
        updateData.attempts = {
          increment: 1,
        };
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
