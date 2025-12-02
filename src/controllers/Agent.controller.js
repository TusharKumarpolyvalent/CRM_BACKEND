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
    let attempt = n.toString();
    const updatedLead = await updateLead(parseInt(leadId), {
      status,
      remark,
      lastcall,
      attempt,
    });
    res.send(updatedLead);
  } catch (err) {
    console.log(err.message);

    res.send(err);
  }
};
