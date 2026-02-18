const XLSX = require('xlsx');
const prisma = require('../config/prisma');
const {
  createCampaign,
  fetchAllCampaigns,
  createLeads,
  fetchCampaignLeads,
  createUser,
  fetchAllUsers,
  giveAgentToLeads,
  deleteCampaignService,
  updateCheckedClientLead,
  updateReassignService,
  clearReassignService,
} = require('../services/Admin.service');

module.exports.addCampaign = async (req, res) => {
  try {
    const {
      id,
      name,
      client_name,
      meta_date,
      start_date,
      end_date,
      created_at,
      // update_date,
    } = req.body;
    const response = await createCampaign({
      id,
      name,
      client_name,
      meta_date,
      start_date,
      end_date,
      created_at,
      // update_date,
    });
    res.status(201).json({
      message: 'Campaign created successfully',
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during Campaign creation',
      error: err.message,
    });
  }
};

module.exports.getCampaign = async (req, res) => {
  try {
    const campaigns = await fetchAllCampaigns();
    res.status(200).json({
      message: 'Campaigns fetched successfully',
      data: campaigns,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during fetching campaigns',
      error: err.message,
    });
  }
};

module.exports.addLeads = async (req, res) => {
  try {
    const { campaign_id, name, phone, email, city, product, source } = req.body;

    const response = await createLeads({
      campaign_id,
      name,
      phone,
      email,
      city,
      product,
      source,
    });
    res.status(201).json({
      message: 'Lead created successfully',
      data: response,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during adding Leads',
      error: err.message,
    });
  }
};
module.exports.addUser = async (req, res) => {
  console.log('🔥 ADD USER API HIT');
  console.log('BODY:', req.body);
};

module.exports.importLeads = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });

    // Read Excel from memory
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON array
    const leadsArray = XLSX.utils.sheet_to_json(worksheet);

    // Insert each lead into DB
    const insertedLeads = [];
    for (const lead of leadsArray) {
      const leadobj = {
        campaign_id: lead.campaign_id ? lead.campaign_id.toString() : '-',
        name: lead.name ? lead.name.toString() : '-',
        phone: lead.phone ? lead.phone.toString() : '-',
        email: lead.email ? lead.email.toString() : '-',
        city: lead.city ? lead.city.toString() : '-',
        product: lead.product ? lead.product.toString() : '-',
        source: lead.source ? lead.source.toString() : '-',
      };
      const savedLead = await createLeads(leadobj);
      insertedLeads.push(savedLead);
    }

    res.status(200).json({
      success: true,
      message: 'Leads imported successfully',
      total: insertedLeads.length,
      data: insertedLeads,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during lead import',
      error: err.message,
    });
  }
};

module.exports.getLeads = async (req, res) => {
  try {
    const { id, assigned, date, fromDate, toDate } = req.query;

    console.log('🚀 GET /get-leads API Called with:', {
      id,
      assigned,
      date,
      fromDate,
      toDate,
    });

    const Leads = await fetchCampaignLeads(
      id,
      assigned === 'false' ? null : assigned,
      date,
      fromDate,
      toDate
    );

    console.log(`📊 Returning ${Leads.length} leads`);
    console.log('Query params:', { id, assigned, date, fromDate, toDate });

    // ✅ success: true add करें
    res.status(200).json({
      success: true, // ❗ यह line add करें
      message: 'Leads fetched successfully',
      data: Leads,
    });
  } catch (err) {
    console.error('❌ Error in getLeads:', err);
    res.status(500).json({
      success: false, // ❗ success: false
      message: 'Internal Server Error during fetching Leads',
      error: err.message,
    });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { id, name, email, password, role } = req.body;
    const user = await createUser({ id, name, email, password, role });
    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during user creation',
      error: err.message,
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await fetchAllUsers(role);
    res.status(200).json({
      message: 'Users fetched successfully',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during fetching users',
      error: err.message,
    });
  }
};

// module.exports.assignAgent = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const { leadIds } = req.body;
//     const parsedLeadIds = JSON.parse(leadIds);

//     const assignedLeads = await giveAgentToLeads(parsedLeadIds, agentId);
//     return res.status(200).json({
//       message: 'Lead assigned successfully',
//       data: assignedLeads,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: 'Internal Server Error during assign Leads',
//       error: err.message,
//     });
//   }
// };

module.exports.deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Campaign id is required',
      });
    }

    console.log('🗑️ Deleting campaign with id:', id);

    const deleted = await deleteCampaignService(id);

    return res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('❌ deleteCampaign controller error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message,
    });
  }
};

module.exports.checkedClientLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { checkedclientlead } = req.body;

    const updatedLead = await updateCheckedClientLead(id, checkedclientlead);

    return res.status(200).json({
      success: true,
      message: 'Checked client lead updated',
      data: updatedLead,
    });
  } catch (error) {
    console.error('checkedClientLead error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update checked client lead',
      error: error.message,
    });
  }
};
// Admin.controller.js में नीचे checkedClientLead के बाद add करें

module.exports.updateReassign = async (req, res) => {
  try {
    const { leadIds, reassignData } = req.body;

    const updatedLeads = await updateReassignService(leadIds, reassignData);

    return res.status(200).json({
      success: true,
      message: 'Reassign status updated successfully',
      data: updatedLeads,
    });
  } catch (error) {
    console.error('updateReassign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update reassign status',
      error: error.message,
    });
  }
};

module.exports.clearReassign = async (req, res) => {
  try {
    const { leadId } = req.body;

    const updatedLead = await clearReassignService(leadId);

    return res.status(200).json({
      success: true,
      message: 'Reassign status cleared successfully',
      data: updatedLead,
    });
  } catch (error) {
    console.error('clearReassign error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear reassign status',
      error: error.message,
    });
  }
};

// assignAgent function को update करें
// Admin.controller.js में assignAgent function को एक ही बार रखें:

module.exports.assignAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { leadIds, reassignData } = req.body;

    console.log('🔍 AssignAgent called with:', {
      agentId,
      leadIds,
      reassignData,
    });

    // Parse leadIds
    let parsedLeadIds;
    try {
      parsedLeadIds =
        typeof leadIds === 'string' ? JSON.parse(leadIds) : leadIds;
    } catch (error) {
      parsedLeadIds = leadIds; // If it's already an array
    }

    // अब giveAgentToLeads को reassignData भी pass करें
    const assignedLeads = await giveAgentToLeads(
      parsedLeadIds,
      agentId,
      reassignData
    );

    console.log(
      `✅ Assigned ${parsedLeadIds.length} leads to agent ${agentId}`
    );

    return res.status(200).json({
      message: 'Lead assigned successfully',
      data: assignedLeads,
    });
  } catch (err) {
    console.error('❌ Error in assignAgent:', err);
    res.status(500).json({
      message: 'Internal Server Error during assign Leads',
      error: err.message,
    });
  }
};
module.exports.getCampaignPerformance = async (req, res) => {
  try {
    const { campaign_id, fromDate, toDate } = req.query;

    if (!campaign_id) {
      return res.status(400).json({
        success: false,
        message: 'campaign_id is required',
      });
    }

    const where = { campaign_id };

    if (fromDate && toDate) {
      // Parse YYYY-MM-DD as local date to avoid timezone shift
      const [fy, fm, fd] = fromDate.split('-').map((v) => Number(v));
      const [ty, tm, td] = toDate.split('-').map((v) => Number(v));

      const start = new Date(fy, fm - 1, fd);
      start.setHours(0, 0, 0, 0);
      const end = new Date(ty, tm - 1, td);
      end.setHours(23, 59, 59, 999);
      where.last_call = { gte: start, lte: end };
    }

    // Prisma fetch
    const leads = await prisma.Leads.findMany({
      where,
      select: {
        source: true,
        status: true, // status = 'qualified' / 'unqualified'
      },
    });

    // Group by source
    const performance = {};
    leads.forEach((lead) => {
      const src = lead.source || 'Unknown';
      if (!performance[src]) performance[src] = { total: 0, qualified: 0 };
      performance[src].total += 1;
      if (lead.status && lead.status.toLowerCase() === 'qualified')
        performance[src].qualified += 1;
    });

    const result = Object.keys(performance).map((source) => {
      const { total, qualified } = performance[source];
      return {
        source_name: source,
        total_leads: total,
        total_qualified: qualified,
        qualified_percent: total ? Math.round((qualified / total) * 100) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Campaign performance fetched successfully',
      data: result,
    });
  } catch (err) {
    console.error('❌ getCampaignPerformance error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin.controller.js mein getAgentPerformance function replace karo
module.exports.getAgentPerformance = async (req, res) => {
  try {
    const { agent_id, fromDate, toDate } = req.query;

    if (!agent_id) {
      return res.status(400).json({
        success: false,
        message: 'agent_id is required',
      });
    }

    // Date range prepare karo
    let startDate, endDate;
    if (fromDate && toDate) {
      startDate = new Date(fromDate);
      endDate = new Date(toDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    console.log('🔍 Fetching calls for agent:', { agent_id, fromDate, toDate });

    // ✅ FIX: "lead" use karo (lowercase L)
    const callLogs = await prisma.callLog.findMany({
      where: {
        agent_id: agent_id,
        ...(startDate && endDate
          ? {
              called_at: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {}),
      },
      include: {
        lead: {
          // 👈 YAHAN "lead" (lowercase L)
          include: {
            Campaign: true,
          },
        },
      },
      orderBy: {
        called_at: 'desc',
      },
    });

    // console.log('le le' callLogs);

    console.log(`📞 Agent ${agent_id} ne ${callLogs.length} total calls kiye`);

    // Campaign-wise grouping
    const campaignMap = new Map();
    let totalConnected = 0;
    let totalNotConnected = 0;
    let totalQualified = 0;
    let totalNotQualified = 0;

    callLogs.forEach((log) => {
      // ✅ FIX: log.lead use karo (log.Lead nahi)
      const campaignName = log.lead?.Campaign?.name || 'Unknown Campaign';
      const leadStatus = log.lead?.status || 'unknown';

      if (!campaignMap.has(campaignName)) {
        campaignMap.set(campaignName, {
          campaign_name: campaignName,
          total_call_count: 0,
          connected: 0,
          not_connected: 0,
          qualified: 0,
          not_qualified: 0,
        });
      }

      const campaign = campaignMap.get(campaignName);
      campaign.total_call_count++;

      // Status count
      const status = (leadStatus || '').toLowerCase();
      if (status.includes('connected') || status === 'connected') {
        campaign.connected++;
        totalConnected++;
      } else if (
        status.includes('not connected') ||
        status === 'not connected'
      ) {
        campaign.not_connected++;
        totalNotConnected++;
      } else if (status.includes('qualified') || status === 'qualified') {
        campaign.qualified++;
        totalQualified++;
      } else if (
        status.includes('not qualified') ||
        status === 'not qualified'
      ) {
        campaign.not_qualified++;
        totalNotQualified++;
      }
    });

    const campaignWise = Array.from(campaignMap.values());
    const totalCalls = callLogs.length;

    return res.status(200).json({
      success: true,
      data: {
        campaign_wise: campaignWise,
        summary: {
          total_calls: totalCalls,
          connected: totalConnected,
          not_connected: totalNotConnected,
          qualified: totalQualified,
          not_qualified: totalNotQualified,
        },
      },
    });
  } catch (error) {
    console.error('❌ Agent performance error:', error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getDailyCallCount = async (req, res) => {
  try {
    const { agentId, date } = req.query;

    if (!agentId || !date) {
      return res.status(400).json({
        success: false,
        message: 'agentId and date are required',
      });
    }

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const count = await prisma.callLog.count({
      where: {
        agent_id: agentId.toString(),
        called_at: {
          gte: start,
          lte: end,
        },
      },
    });

    return res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error('❌ Daily Call Count Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching daily call count',
    });
  }
};
