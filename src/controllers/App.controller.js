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

    // Define the start of today (00:00:00)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const lead = await prisma.leads.findFirst({
      where: {
        assigned_to: agentId,
        OR: [
          { status: 'New' },
          {
            AND: [
              { reassign: { not: null } },
              { reassign: { not: '' } },
              {
                last_call: {
                  lt: startOfToday, // This checks created_at is NOT today (it's older)
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        phone: true,
        city: true,
        product: true,
        status: true,
        reassign: true,
        created_at: true, // Recommended to select this for verification
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    if (!lead || lead.length === 0) {
      return res.status(404).json({
        success: true, // Changed to true if technically successful but empty, or keep false if business logic requires
        message: 'No New or Reassigned Lead Found',
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Leads fetched successfully',
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
