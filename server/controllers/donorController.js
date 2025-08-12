import Donation from "../models/Donation.js";
import Donor from "../models/Donor.js";

// GET /api/donor/list
export const listDonors = async (req, res) => {
  try {
    const donors = await Donor.find({});
    res.json({ success: true, donors });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// // POST /api/donor/add
// export const addDonor = async (req, res) => {
//   try {
//     const { _id, name, email, image } = req.body;
//     if (!_id || !name || !email || !image) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }
//     // Upsert: Create new or update existing
//     const donor = await Donor.findByIdAndUpdate(_id, {
//       _id, name, email, image
//     }, { upsert: true, new: true, setDefaultsOnInsert: true });

//     res.json({ success: true, donor });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


