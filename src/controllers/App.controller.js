const prisma = require('../config/prisma');

module.exports.getAppLead = async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: 'Agent ID required',
      });
    }
    const lead = await prisma.leads.findFirst({
      where: {
        assigned_to: agentId,
        status: {
          equals: 'New',
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        city: true,
        product: true,
        status: true,
      },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'No New Lead Found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Lead fetched successfully',
      data: lead,
    });
  } catch (error) {
    console.error('❌ App Lead Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
