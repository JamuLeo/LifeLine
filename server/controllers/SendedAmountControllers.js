import SendedAmount from "../models/SendedAmount.js";





export const sendedAmountsByPatient = async (req, res) => {
  try {
    const patientId = req.patientId;
    const sended = await SendedAmount.find({ patientId });
    res.json({ success: true, sended });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};



export const sendedAmountsAll = async (req, res) => {
  try {
    const sended = await SendedAmount.find({});
    res.json({ success: true, sended });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};