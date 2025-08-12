import { v2 as cloudinary } from "cloudinary";
import Campaign from "../models/Campaign.js";

// Add Campaign : /api/campaign/add
export const addCampaign = async (req, res) => {
    try {
        let campaignData = JSON.parse(req.body.campaignData);
        campaignData.patientId = req.patientId;
        const images = req.files;

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        );

        await Campaign.create({ ...campaignData, image: imagesUrl });
        res.json({ success: true, message: "Campaign Created" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Campaign : /api/campaign/list
export const campaignList = async (req, res) => {
  try {
    const campaigns = await Campaign.find({})
      .populate('address')   
      .populate('account');  
    res.json({ success: true, campaigns });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get single Campaign : /api/campaign/id
export const campaignById = async (req, res) => {
    try {
        const { id } = req.body;
        const campaign = await Campaign.findById(id);
        res.json({ success: true, campaign });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Get Campaigns by Patient ID : /api/campaign/patient
export const campaignsByPatient = async (req, res) => {
  try {
    const patientId = req.patientId; 
    const campaigns = await Campaign.find({ patientId })
      .populate('address')   
      .populate('account');  
    res.json({ success: true, campaigns });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/campaign/by-patient/:id
export const campaignsByPatientId = async (req, res) => {
  try {
    const { id } = req.params;
    const campaigns = await Campaign.find({ patientId: id })
      .populate('address')
      .populate('account');
    res.json({ success: true, campaigns });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Campaign : /api/campaign/delete/:id
export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        
        // First find the campaign to get image URLs
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ success: false, message: "Campaign not found" });
        }

        // Delete images from Cloudinary
        if (campaign.image && campaign.image.length > 0) {
            await Promise.all(
                campaign.image.map(async (imageUrl) => {
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                })
            );
        }

        // Delete campaign from database
        await Campaign.findByIdAndDelete(id);
        
        res.json({ success: true, message: "Campaign deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// change campaign Approve : /api/campaign/approve
export const changeApprove = async (req, res) => {
    try {
        const { id, isApprove } = req.body;
        await Campaign.findByIdAndUpdate(id, { isApprove });
        res.json({ success: true, message: "Campaign Verification Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// change campaign Emergency : /api/campaign/emergency
export const changeEmergency = async (req, res) => {
    try {
        const { id, isEmergency } = req.body;
        await Campaign.findByIdAndUpdate(id, { isEmergency });
        res.json({ success: true, message: "Campaign Emergency Status Updated" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};