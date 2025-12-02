const { fetchLead, updateLead } = require('../services/Agent.service');

module.exports.fetchAgentLeads = async (req, res) => {
  try {
    const { id } = req.query;

    const leads = await fetchLeads(id);
    return res.status(200).json({
      message: 'Lead fetch successfully',
      data: leads,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during fetch agent leads',
      error: err.message,
    });
  }
};

module.exports.leadFollowUp = async (req, res) => {
  try {
    const { status, remark, lastcall } = req.body;
    const { leadId } = req.params;
    const lead = await fetchLead(parseInt(leadId));
    let n = parseInt(lead.attempts);
    ++n;
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
