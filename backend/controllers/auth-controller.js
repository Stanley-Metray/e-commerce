import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateToken = async (user) => {
    const payload = {
        id: user.id,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.JWT_SECRETE_KEY, { expiresIn: '7d' });
    return token;
};

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).sendFile(path.join(__dirname, "../../frontend/views", "auth-error.html"));

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).sendFile(path.join(__dirname, "../../frontend/views", "auth-error.html"));
        }
        req.body.userId = decoded.id;
        next();
    });
};

export const verifyTokenForSocket = async (token) => {
    if (!token)
        return null;

    return jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return null;
        }
        return decoded.id;
    });
};
