import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'crm-system-super-secret-key-12345';
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization token missing or malformed' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}
export { JWT_SECRET };
