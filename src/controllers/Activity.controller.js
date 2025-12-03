const { createActivity } = require('../services/Activity.service');

module.exports.addActivity = async (req, res) => {
  try {
    const data = req.body;
    const activity = await createActivity(data);
    res.status(200).json({
      message: 'Activity record successfully',
      data: activity,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during record activity',
      error: err.message,
    });
  }
};
