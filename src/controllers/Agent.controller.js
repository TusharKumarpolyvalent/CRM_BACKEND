const {
  fetchLeads,
  updateLead,
  fetchRecordWithId,
  updateLeadRecord,
  createLeadRecord,
  updateLeads,
} = require('../services/Agent.service');

module.exports.fetchAgentLeads = async (req, res) => {
  try {
    const { id } = req.query;

    const Leads = await fetchLeads(id);
    return res.status(200).json({
      message: 'Lead fetch successfully',
      data: Leads,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during fetch agent Leads',
      error: err.message,
    });
  }
};

// agent.controller.js में
// agent.controller.js में leadFollowUp function update करें

module.exports.updateLeadAddress = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { city, pincode } = req.body;

    if (!city && !pincode) {
      return res.status(400).json({
        success: false,
        message: 'City or Pincode required',
      });
    }

    const updatedLead = await updateLeads(parseInt(leadId), {
      city,
      pincode,
    });

    return res.status(200).json({
      success: true,
      message: 'Lead address updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    console.error('❌ updateLeadAddress error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update lead address',
    });
  }
};

module.exports.leadFollowUp = async (req, res) => {
  try {
    const { status, remark, reason, last_call } = req.body; // ✅ last_call add करें
    const { leadId } = req.params;

    console.log('📥 leadFollowUp request received:', {
      leadId,
      status,
      remark,
      reason,
      last_call,
    });

    const lead = await fetchRecordWithId('Leads', parseInt(leadId));

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead ${leadId} not found`,
      });
    }

    // ✅ unlimited attempts
    const attempts = parseInt(lead.attempts || '0') + 1;

    // ✅ Use provided last_call or current time
    const lastcall = last_call ? new Date(last_call) : new Date();

    await updateLead(parseInt(leadId), {
      status,
      remark,
      lastcall, // ✅ यहाँ pass करें
      attempt: attempts.toString(),
      docStatus: 'review',
      reason,
    });

    console.log('✅ Lead updated with last_call:', lastcall);

    return res.status(200).json({
      success: true,
      message: 'Follow-up saved successfully',
      data: {
        id: parseInt(leadId),
        last_call: lastcall.toISOString(),
        status,
        attempts: attempts.toString(),
      },
    });
  } catch (err) {
    console.error('❌ Error in leadFollowUp:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error during lead follow up',
      error: err.message,
    });
  }
};

module.exports.addLeadRecord = async (req, res) => {
  try {
    const { leadId } = req.params;
    const data = req.body;

    const lead = await fetchRecordWithId('LeadRecord', leadId);

    let leadRecord;
    if (lead) {
      leadRecord = await updateLeadRecord(leadId, data);
    } else {
      leadRecord = await createLeadRecord({ ...data, id: leadId });
    }
    return res.status(200).json({
      message: 'Lead record create successfully',
      data: leadRecord,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during  lead record',
      error: err.message,
    });
  }
};

// Agent.controller.js में change करें:

// Agent.controller.js - updateLeadDetails fix karein
module.exports.updateLeadDetails = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { status, reason, remarks, followupAt } = req.body;

    console.log('🚀 updateLeadDetails called:', {
      leadId: parseInt(leadId),
      status,
      reason,
      remarks,
      followupAt,
    });

    // Get current lead first to calculate attempts
    const lead = await fetchRecordWithId('Leads', parseInt(leadId));

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead ${leadId} not found`,
      });
    }

    // Calculate attempts
    const attempts = parseInt(lead.attempts || '0') + 1;

    // Use updateLead function with correct parameters
    const updatedLead = await updateLead(parseInt(leadId), {
      status,
      remark: remarks || '', // Pass as 'remark'
      lastcall: new Date(),
      attempt: attempts.toString(), // Provide attempt value
      docStatus: 'review',
      reason,
    });

    console.log('✅ Lead updated successfully:', {
      id: updatedLead.id,
      newStatus: updatedLead.status,
      newAttempts: updatedLead.attempts,
    });

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    console.error('❌ Error in updateLeadDetails:', {
      message: err.message,
      stack: err.stack,
      leadId: req.params.leadId,
    });
    res.status(500).json({
      success: false,
      message: 'Internal Server Error during lead update',
      error: err.message,
    });
  }
};
