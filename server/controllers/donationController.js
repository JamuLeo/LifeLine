import stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import Campaign from "../models/Campaign.js";
import Donation from "../models/Donation.js";
import Donor from '../models/Donor.js'; // Adjust the path as necessary
import { sendDonationReceipt } from "../utils/mailer.js";


export const createDonation = async (req, res) => {
  try {
    const { campaignId, donorId, amount, message, isAnonymous } = req.body;

    // (Your validation and donation creation code)
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.json({ success: false, message: "Campaign not found" });
    if (!campaign.isApprove) return res.json({ success: false, message: "Campaign is private" });
    if (!donorId) return res.json({ success: false, message: "Login required" });
    if (amount < 100) return res.json({ success: false, message: "Minimum amount is 100" });

    const donation = await Donation.create({
      donorId, campaign: campaignId, amount, message, isAnonymous,
    });

    campaign.collectedAmount += amount;
    await campaign.save();

    // --------- MAIL LOGIC HERE ---------
    // Only send if NOT anonymous, and donor exists
    if (!isAnonymous && donorId) {
      const donor = await Donor.findOne({ donorId }) || await Donor.findById(donorId);
      if (donor && donor.email) {
        try {
          await sendDonationReceipt({
            to: donor.email,
            name: donor.name,
            amount,
            campaignTitle: campaign.title
          });
        } catch (mailError) {
          console.log('Email failed:', mailError);
        }
      }
    }
    // --------- END MAIL LOGIC ----------

    res.json({ success: true, message: "Donation Successful", donation });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// List all donations (for admin)
export const allDonations = async (req, res) => {
    try {
        const donations = await Donation.find({})
            .populate('donorId', 'name email')
            .populate('campaign', 'title');
        res.json({ success: true, donations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// List patient/donor's donations (use donorId from JWT)
// export const userDonations = async (req, res) => {
//     try {
//         const donorId = req.auth.donorId || req.userId;
//         const donations = await Donation.find({ donorId })
//             .populate('campaign', 'title');
//         res.json({ success: true, donations });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };





// controllers/donationController.js
export const userDonations = async (req, res) => {
    try {
        let donorId = null;
        // Clerk v4+: req.auth() returns {userId,...}
        if (typeof req.auth === "function") {
            const auth = req.auth();
            donorId = auth && auth.userId;
        }
        donorId = donorId || req.donorId; // fallback if you ever have legacy
        if (!donorId) return res.json({ success: false, message: "Not authorized" });

        const donations = await Donation.find({ donorId })
            .populate('campaign', 'title image category')
            .sort({ createdAt: -1 });

        res.json({ success: true, donations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};




// GET /api/donation/campaign/:campaignId
export const campaignDonations = async (req, res) => {
  try {
    const { campaignId } = req.params;
    const donations = await Donation.find({ campaign: campaignId })
      .populate('donorId', 'name email image')
      .sort({ createdAt: -1 });

    res.json({ success: true, donations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};







// Get Donations by Donor ID: /api/donation/user
export const getDonorDonation = async (req, res) => {
    try {
        // For Clerk-authenticated donors
        const donorId = req.donorId || req.auth?.userId;
        if (!donorId) return res.json({ success: false, message: "Not authorized" });

        const donations = await Donation.find({ donorId })
            .populate("items.campaign")
            .sort({ createdAt: -1 });

        res.json({ success: true, donations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


//Get All Orders ( for admin) : /api/order/admin
export const getAllDonation = async (req, res) => {
    try {
        // Only accessible to admin (protected by your JWT middleware)
        const donations = await Donation.find({})
            .populate("items.campaign")
            .sort({ createdAt: -1 });

        res.json({ success: true, donations });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/donation/donor/:id
export const donationsByDonor = async (req, res) => {
  try {
    const donorId = req.params.id;
    const donations = await Donation.find({ donorId })
      .populate('campaign')
      .sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





