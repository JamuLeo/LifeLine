import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import Donor from '../models/Donor.js';
import Patient from '../models/Patient.js';
import dayjs from 'dayjs';

// GET /api/admin/dashboard-stats
export const dashboardStats = async (req, res) => {
  try {
    // Total Campaigns
    const totalCampaigns = await Campaign.countDocuments();

    // Total Donations (sum of all donations)
    const donationsAgg = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalDonations = donationsAgg[0]?.total || 0;

    // Active Users (Donors + Patients)
    const [donorCount, patientCount] = await Promise.all([
      Donor.countDocuments(),
      Patient.countDocuments(),
    ]);
    const activeUsers = donorCount + patientCount;

    // New Campaigns This Month
    const thisMonth = dayjs().startOf('month').toDate();
    const newCampaignsThisMonth = await Campaign.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Donations by Category (group by category, sum amounts)
    const donationsByCategory = await Donation.aggregate([
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaign',
          foreignField: '_id',
          as: 'campaignObj'
        }
      },
      { $unwind: "$campaignObj" },
      {
        $group: {
          _id: "$campaignObj.category",
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1
        }
      }
    ]);

    // Campaign Growth (last 6 months, count per month)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(dayjs().subtract(i, 'month').startOf('month'));
    }
    const campaignGrowth = await Promise.all(
      months.map(async (month, idx) => {
        const nextMonth = month.add(1, 'month');
        const count = await Campaign.countDocuments({
          createdAt: { $gte: month.toDate(), $lt: nextMonth.toDate() }
        });
        return {
          month: month.format('MMM'),
          count
        };
      })
    );

    // Recent Activities: last 10 donations/campaigns (for demo; customize as needed)
    const recentDonations = await Donation.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('donorId', 'name')
      .populate('campaign', 'title');
    const recentCampaigns = await Campaign.find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('patientId', 'name');

    // Merge and sort by date for activities
const recentActivities = [
  ...recentDonations.map(d => ({
    user: d.donorId?.name || "Donor",
    action: "Donated",
    campaign: d.campaign?.title || "",
    date: dayjs(d.createdAt).format("YYYY-MM-DD"),
    role: "Donor"
  })),
  ...recentCampaigns.map(c => ({
    user: c.patientId?.name || "Patient",
    action: "Created Campaign",
    campaign: c.title,
    date: dayjs(c.createdAt).format("YYYY-MM-DD"),
    role: "Patient"
  }))
].sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf()).slice(0, 10);


    // Send all stats
    res.json({
      success: true,
      stats: {
        totalCampaigns,
        totalDonations,
        activeUsers,
        newCampaignsThisMonth,
        donationsByCategory,
        campaignGrowth,
        recentActivities
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
