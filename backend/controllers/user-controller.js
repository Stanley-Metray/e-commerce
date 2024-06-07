import User from "../models/user.js";
import Product from "../models/product.js";
import bcrypt from 'bcrypt';
import { generateToken } from './auth-controller.js';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const views = path.join(__dirname, "../../frontend/views");

export const getRegistration = (req, res) => {
    res.status(200).sendFile(views + '/registration.html');
};

export const postRegister = async (req, res) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const createdUser = await User.create(req.body);

        const token = await generateToken({ id: createdUser.id, email: createdUser.email });

        let tokens = [];
        if (createdUser.tokens && createdUser.tokens.length > 0) {
            tokens = JSON.parse(createdUser.tokens);
        }
        tokens.push(token);
        createdUser.tokens = JSON.stringify(tokens);
        await createdUser.save();
        res.status(201).json({ user: createdUser.name, success: true, token: token, message: "Registration Successful" });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};

export const getLoginUser = (req, res) => {
    res.status(200).sendFile(views + '/login.html');
};

export const postLoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            res.status(404).json({ message: "User not found, please register", success: false, error: "404 error, User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password", success: false, error: "401 error, Unauthorized" });
            return;
        }

        const token = await generateToken({ id: user.id, email: user.email });

        let tokens = [];
        if (user.tokens && user.tokens.length > 0) {
            tokens = JSON.parse(user.tokens);
        }
        tokens.push(token);
        user.tokens = JSON.stringify(tokens);

        await user.save();
        res.status(201).json({ user: user.name, success: true, token: token, message: "Login Successful" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};


export const postCart = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to add item into cart", success: false, error: "404 error, Unauthorized access" });
            return;
        }

        const product = await Product.findByPk(req.body.productId);

        if (product.quantity === 0 || product.quantity < req.body.quantity)
            return res.status(200).json({ success: false, message: "Failed to add item into cart" });
        else {
            const cart = user.cart;
            cart.push({ productId: req.body.productId, quantity: req.body.quantity });
            const [affectedRows] = await User.update({ cart: cart }, { where: { id: req.body.userId } });

            if (affectedRows > 0) {
                res.status(201).json({ success: true, message: "Item added to cart" });
            } else {
                res.status(500).json({ success: false, message: "Failed to add item into cart" });
            }
        }

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};

export const getCartProducts = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to add item into cart", success: false, error: "404 error, Unauthorized access" });
            return;
        }

        const products = await Promise.all(user.cart.map(async (cartItem) => {
            const product = await Product.findByPk(cartItem.productId, {
                attributes: ["id", "productName", "price", "imageUrl"]
            });
            if (product) {
                product.quantity = cartItem.quantity;
                return product;
            }
        }));

        const filteredProducts = products.filter(product => product !== undefined);

        const totalProducts = filteredProducts.length;
        let totalPrice = filteredProducts.reduce((total, product) => {
            const price = parseFloat(product.price) || 0;
            const quantity = parseFloat(product.quantity) || 0;
            return total + (price * quantity);
        }, 0);
        
        
        totalPrice = totalPrice.toFixed(2);
        res.status(200).json({ success: true, cart: filteredProducts, totalProducts, totalPrice });
    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
        console.log(error);
    }
};

export const getCart = async (req, res)=>{
    res.sendFile(views+"/cart.html");
}