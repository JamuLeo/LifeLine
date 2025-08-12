import Address from "../models/Address.js"

// ADD Address : /api/address/add
export const addAddress = async (req, res) => {
    try {
        const patientId = req.patientId; // get from JWT middleware
        const { street, city, province, phone } = req.body;

        if (!street || !city || !province || !phone) {
            return res.json({ success: false, message: "All fields are required" });
        }

        await Address.create({ patientId, street, city, province, phone });
        res.json({ success: true, message: "Address added successfully" });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

// Get Address : /api/address/get
export const getAddress = async (req, res) => {
    try {
        const patientId = req.patientId;
        const addresses = await Address.find({ patientId });
        res.json({ success: true, addresses });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}
