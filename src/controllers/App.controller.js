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

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    // ✅ Only 1 Latest Fresh Lead
    const leads = await prisma.$queryRaw`
  SELECT *
  FROM Leads
  WHERE assigned_to = ${agentId}
  AND last_assigned_at >= ${startOfToday}
  AND last_assigned_at < ${endOfToday}
  AND (status = 'New' OR reassign IS NOT NULL)
  AND (
        last_call IS NULL
        OR last_call < last_assigned_at
      )
  ORDER BY last_assigned_at DESC, name ASC
  LIMIT 1
`;

    if (!leads || leads.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No New or Reassigned Lead Found',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: leads.length
        ? 'Lead fetched successfully1'
        : 'No New or Reassigned Lead Found',
      data: leads, // 🔥 Always array
    });
  } catch (error) {
    console.error('❌ App Lead Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
