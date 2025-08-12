import jwt from 'jsonwebtoken';

const authPatient = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized' });
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET not set');
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.patientId = tokenDecode.id; 
            return next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authPatient;

