const prisma = require('../config/prisma');

module.exports.fetchRecordWithId = async (table, id) => {
  return prisma[table].findUnique({
    where: { id: id },
  });
};
module.exports.fetchLeads = async (id) => {
  return prisma.Leads.findMany({
    where: { assigned_to: id },
    orderBy: { name: 'asc' },
  });
};

module.exports.updateLead = async (
  id,
  { status, remark, lastcall, attempt, docStatus, reason }
) => {
  return await prisma.$transaction(async (tx) => {
    const currentLead = await tx.Leads.findUnique({ where: { id } });
    const currentAttempts = currentLead?.attempts ?? 0;
    const attemptsAfter = currentAttempts + 1;

    // 🔥 10 Attempts Limit Check
    if (attemptsAfter > 10) {
      throw new Error('Maximum attempts limit reached (10)');
    }

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

    // 🔥 Dynamic keys for current attempt (e.g., status4, remark4)
    const statusField = `status${attemptsAfter}`;
    const remarkField = `remark${attemptsAfter}`;

    const existingRecord = await tx.Leadrecord.findUnique({
      where: { id: id.toString() },
    });

    if (existingRecord) {
      // 🚀 Record exists: Prisma automatically updates 'updated_at' here. 'created_at' remains intact.
      await tx.Leadrecord.update({
        where: { id: id.toString() },
        data: {
          [statusField]: status,
          [remarkField]: remark,
        },
      });
    } else {
      // 🚀 First attempt: Both 'created_at' and 'updated_at' will be the exact same time.
      await tx.Leadrecord.create({
        data: {
          id: id.toString(),
          [statusField]: status,
          [remarkField]: remark,
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
    return await prisma.$transaction(async (tx) => {
      const updateData = {
        status: data.status,
        remarks: data.remarks || data.remark,
        reason: data.reason,
        last_call: new Date(),
      };

      if (data.city) updateData.city = data.city;
      if (data.pincode) updateData.pincode = data.pincode;
      if (data.name) updateData.name = data.name;
      if (data.followupAt) updateData.followup_at = new Date(data.followupAt);

      const currentLead = await tx.Leads.findUnique({
        where: { id: leadId },
      });

      const currentAttempts = currentLead?.attempts ?? 0;
      const attemptsAfter = currentAttempts + 1;

      // 🔥 10 Attempts Limit Check
      if (attemptsAfter > 10) {
        throw new Error('Maximum attempts limit reached (10)');
      }

      updateData.attempts = { increment: 1 };

      const updatedLead = await tx.Leads.update({
        where: { id: leadId },
        data: updateData,
      });

      // 🔥 Dynamic keys based on attempt number
      const statusField = `status${attemptsAfter}`;
      const remarkField = `remark${attemptsAfter}`;

      const existingRecord = await tx.Leadrecord.findUnique({
        where: { id: leadId.toString() },
      });

      if (existingRecord) {
        // 🚀 Prisma updates 'updated_at' here automatically
        await tx.Leadrecord.update({
          where: { id: leadId.toString() },
          data: {
            [statusField]: data.status,
            [remarkField]: data.remarks || data.remark,
          },
        });
      } else {
        await tx.Leadrecord.create({
          data: {
            id: leadId.toString(),
            [statusField]: data.status,
            [remarkField]: data.remarks || data.remark,
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
