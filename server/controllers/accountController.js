import Account from "../models/Account.js";



// ADD Account : /api/account/add
export const addAccount = async (req, res) => {
    try {
        const patientId = req.patientId; // from JWT middleware
        const { fullName, bankName, accNumber, branch } = req.body;

        if (!fullName || !bankName || !accNumber || !branch) {
            return res.json({ success: false, message: "All fields are required" });
        }
        await Account.create({ patientId, fullName, bankName, accNumber, branch });
        res.json({ success: true, message: "Account added successfully" });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

// Get Account : /api/account/get
export const getAccount = async (req, res) => {
    try {
        const patientId = req.patientId;
        const accounts = await Account.find({ patientId });
        res.json({ success: true, accounts });
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}
