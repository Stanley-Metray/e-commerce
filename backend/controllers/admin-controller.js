import Admin from "../models/admin.js";
import bcrypt from 'bcrypt';
import { generateToken} from './auth-controller.js';
import path from 'path';

const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../../frontend/views/');

export const getRegistration = (req, res) => {
    res.status(200).sendFile(filePath + '/admin-registration.html');
};

export const postRegister = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const createdAdmin = await Admin.create(req.body);

        const token = await generateToken({ id: createdAdmin.id, email: createdAdmin.email });

        let tokens = [];
        if (createdAdmin.tokens && createdAdmin.tokens.length > 0) {
            tokens = JSON.parse(createdAdmin.tokens);
        }
        tokens.push(token);
        createdAdmin.tokens = JSON.stringify(tokens);

        await createdAdmin.save();
        res.status(201).json({ Admin: createdAdmin.first_name, success: true, token: token, message: "Registration Successful" });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};

export const getLoginAdmin = (req, res) => {
    res.status(200).sendFile(filePath + '/admin-login.html');
};

export const postLoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const Admin = await Admin.findOne({ where: { email: email } });

        if (!Admin) {
            res.status(404).json({ message: "Admin not found, please register", success: false, error: "404 error, Admin not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, Admin.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password", success: false, error: "401 error, Unauthorized" });
            return;
        }

        const token = await generateToken({ id: Admin.id, email: Admin.email });

        let tokens = [];
        if (Admin.tokens && JSON.parse(Admin.tokens).length > 0) {
            tokens = JSON.parse(Admin.tokens);
        }
        tokens.push(token);
        Admin.tokens = JSON.stringify(tokens);

        await Admin.save();
        res.status(201).json({ Admin: Admin.first_name, success: true, token: token, message: "Login Successful" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};
