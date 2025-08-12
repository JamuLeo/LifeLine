export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit

export const otpExpiry = () => Date.now() + 10 * 60 * 1000; // 10 minutes
