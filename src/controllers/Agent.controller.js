const { fetchLeads } = require('../services/Agent.service');

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
