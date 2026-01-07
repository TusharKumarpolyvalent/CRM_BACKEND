const XLSX = require('xlsx');
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

    const Leads = await fetchCampaignLeads(
      id,
      assigned,
      date,
      fromDate,
      toDate
    );

    res.status(200).json({
      message: 'Leads fetched successfully',
      data: Leads,
    });
  } catch (err) {
    res.status(500).json({
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

module.exports.assignAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const { leadIds } = req.body;
    const parsedLeadIds = JSON.parse(leadIds);

    const assignedLeads = await giveAgentToLeads(parsedLeadIds, agentId);
    return res.status(200).json({
      message: 'Lead assigned successfully',
      data: assignedLeads,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal Server Error during assign Leads',
      error: err.message,
    });
  }
};

module.exports.deleteCampaign = async (req, res) => {
  try {
    const id = req.params.id; // <-- define id here
    console.log('Deleting campaign with id:', id);

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: 'Campaign id is required' });
    }

    // call the service
    const deleted = await deleteCampaignService(id);

    return res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
      data: deleted,
    });
  } catch (error) {
    console.error('Delete campaign error:', error);

    if (error.code === 'P2025') {
      // Prisma error when record not found
      return res
        .status(404)
        .json({ success: false, message: 'Campaign not found' });
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
