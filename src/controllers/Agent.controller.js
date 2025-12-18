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

module.exports.leadFollowUp = async (req, res) => {
  try {
    let docStatus = 'review';
    const { status, remark, lastcall, reason } = req.body;
    const { leadId } = req.params;
    const lead = await fetchRecordWithId('Leads', parseInt(leadId));
    let n = parseInt(lead.attempts);
    ++n;
    if (n === 3) docStatus = 'closed';
    if (n > 3) {
      return res.status(200).json({
        message: 'Lead update limit exceed',
        data: [],
      });
    }
    let attempt = n.toString();
    const updatedLead = await updateLead(parseInt(leadId), {
      status,
      remark,
      lastcall,
      attempt,
      docStatus,
      reason,
    });
    return res.status(200).json({
      message: 'Lead update successfully',
      data: updatedLead,
    });
  } catch (err) {
    res.status(500).json({
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

module.exports.updateLeadDetails = async (req, res) => {
  try {
    const { leadId } = req.params;
    const data = req.body;

    const updatedLead = await updateLeads(parseInt(leadId), data);
    return res.status(200).json({
      message: 'Lead updated successfully',
      data: updatedLead,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during lead update',
      error: err.message,
    });
  }
};
