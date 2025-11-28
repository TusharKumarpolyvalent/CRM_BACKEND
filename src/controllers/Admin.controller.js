const { createCampaign } = require('../services/Admin.service');

module.exports.addCampaign = async (req, res) => {
  try {
    const {
      id,
      name,
      client_name,
      meta_date,
      start_date,
      end_date,
      created_date,
      update_date,
    } = req.body;
    const response = await createCampaign({
      id,
      name,
      client_name,
      meta_date,
      start_date,
      end_date,
      created_date,
      update_date,
    });
    res.status(201).json({
      message: 'Campaign created successfully',
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
    });
  }
};
