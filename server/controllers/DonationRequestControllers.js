import Campaign from "../models/Campaign.js";
import DonationRequest from "../models/DonationRequest.js";
import SendedAmount from "../models/SendedAmount.js";

// Patient creates payout request
export const createRequest = async (req, res) => {
    try {
        const { campaignId, amount, message } = req.body;
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) return res.json({ success: false, message: "Campaign not found" });
        if (String(campaign.patientId) !== req.patientId) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        if (amount > campaign.collectedAmount)
            return res.json({ success: false, message: "Amount exceeds collected amount" });

        const existing = await DonationRequest.findOne({ campaign: campaignId, status: "Pending" });
        if (existing) return res.json({ success: false, message: "A pending request already exists" });

        const request = await DonationRequest.create({
            campaign: campaignId,
            patientId: req.patientId, // Always include this!
            amount,
            message,
            status: "Pending"
        });
        res.json({ success: true, request });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List current patient's requests
export const myRequests = async (req, res) => {
  try {
    // Only for logged-in patient
    const patientId = req.patientId;
    if (!patientId) return res.json({ success: false, message: "Unauthorized" });

    // Find all requests for this patient
    const requests = await DonationRequest.find({ patientId })
      .populate('campaign')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};



// Admin views all requests
export const listRequests = async (req, res) => {
    try {
        const requests = await DonationRequest.find({})
            .populate('campaign')
            .populate('patientId');
        res.json({ success: true, requests });
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
};

// Admin rejects a request
export const rejectRequest = async (req, res) => {
    try {
        const { id, adminReply } = req.body;
        const request = await DonationRequest.findById(id);
        if (!request) return res.json({ success: false, message: "Request not found" });
        request.status = 'Rejected';
        request.adminReply = adminReply;
        await request.save();
        res.json({ success: true, message: "Request rejected" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin sends amount
export const sendAmount = async (req, res) => {
    try {
        const { id } = req.body; // request id
        const request = await DonationRequest.findById(id).populate('campaign');
        if (!request) return res.json({ success: false, message: "Request not found" });
        if (request.status !== "Pending") return res.json({ success: false, message: "Request already processed" });

        // Update request
        request.status = "Sended";
        request.adminReply = "Amount will be credited soon";
        await request.save();

        // Save SendedAmount
        const pendingAmount = request.campaign.collectedAmount - request.amount;
        await SendedAmount.create({
            campaign: request.campaign._id,
            amount: request.amount,
            pendingAmount,
            patientId: request.patientId,
            donationRequestId: id
        });

        // Optionally update campaign collectedAmount if you want to deduct immediately
        // request.campaign.collectedAmount = pendingAmount;
        // await request.campaign.save();

        res.json({ success: true, message: "Amount will be sent soon" });
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
};

// Admin can cancel request (only if pending)
export const cancelRequest = async (req, res) => {
    try {
        const { id } = req.body;
        const request = await DonationRequest.findById(id);
        if (!request || request.status !== "Pending") return res.json({ success: false, message: "Request not found or not pending" });
        await request.deleteOne();
        res.json({ success: true, message: "Request cancelled" });
    } catch (e) {
        res.json({ success: false, message: e.message });
    }
};
