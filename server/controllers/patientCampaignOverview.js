// controllers/campaignOverviewController.js
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import dayjs from "dayjs";

// GET /api/campaign/overview
export const patientCampaignOverview = async (req, res) => {
  try {
    const patientId = req.patientId;

    // All campaigns by this patient
    const campaigns = await Campaign.find({ patientId });
    const campaignIds = campaigns.map(c => c._id);

    // Total campaigns and total collected
    const totalCampaigns = campaigns.length;
    const totalCollected = campaigns.reduce((sum, c) => sum + (c.collectedAmount || 0), 0);

    // Date-wise collected amount (for last 30 days)
    const startDate = dayjs().subtract(29, "day").startOf("day").toDate();
    const donations = await Donation.find({
      campaign: { $in: campaignIds },
      createdAt: { $gte: startDate }
    });

    // Build date series
    const dateMap = {};
    for (let i = 0; i < 30; i++) {
      const d = dayjs().subtract(29 - i, "day").format("YYYY-MM-DD");
      dateMap[d] = 0;
    }
    donations.forEach(d => {
      const dateStr = dayjs(d.createdAt).format("YYYY-MM-DD");
      if (dateMap[dateStr] !== undefined) {
        dateMap[dateStr] += d.amount;
      }
    });
    const collectedPerDay = Object.entries(dateMap).map(([date, amount]) => ({ date, amount }));

    // Table data (image, title, category, goalAmount, collectedAmount)
    const table = campaigns.map(c => ({
      _id: c._id,
      image: c.image?.[0] || "",
      title: c.title,
      category: c.category,
      goalAmount: c.goalAmount,
      collectedAmount: c.collectedAmount
    }));

    res.json({
      success: true,
      data: {
        totalCampaigns,
        totalCollected,
        collectedPerDay,
        table
      }
    });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
