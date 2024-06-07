import User from "../models/user.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const views = path.join(__dirname, "../../frontend/views");

export const getOrder = (req, res)=>{
    res.sendFile(views+"/orders.html");
}

export const postOrder = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to get cart", success: false, error: "404 error, Unauthorized access" });
            return;
        }

        const cart = user.cart;
        if(cart.length<1)
        {
            res.status(404).json({ message: "Failed to place order", success: false, error: "404 error, No Items In Cart" });
            return;
        }
        let totalPrice = 0;
        const productPromises = cart.map(async (item) => {
            const product = await Product.findByPk(item.productId);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.quantity < item.quantity) {
                throw new Error(`Insufficient quantity for product ID ${item.productId}`);
            }

            product.quantity -= item.quantity;
            totalPrice += product.price;
            await Product.update(
                { quantity: product.quantity },
                { where: { id: product.id } }
            );

            return product;
        });

        await Promise.all(productPromises);

        const order = await Order.create({ items: cart, userId: req.body.userId, totalPrice:totalPrice});
        user.cart = [];
        await user.save();

        res.status(201).json({ success: true, message: `Order placed, order id: ${order.id}` });

    } catch (error) {
        console.log(error);
        if (Array.isArray(error.errors)) {
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        } else {
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.message });
        }
    }
};



export const getOrders = async (req, res) => {
    try {
        const user = await User.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to get user", success: false, error: "404 error, Unauthorized access" });
            return;
        }

        const orders = await Order.findAll({
            where: { userId: req.body.userId },
            attributes: ["id", "items", "totalPrice", "createdAt"]
        });

        if (!orders.length) {
            res.status(404).json({ success: false, message: "Failed to fetch orders" });
            return;
        }

        // Fetch all products data for each order
        const ordersWithProductDetails = await Promise.all(orders.map(async (order) => {
            const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
                const product = await Product.findByPk(item.productId, { attributes: ["id", "productName", "price", "description", "imageUrl"] });
                if (!product) {
                    throw new Error(`Product with ID ${item.productId} not found`);
                }
                return { ...item, product };
            }));
            return { ...order.toJSON(), items: itemsWithDetails };
        }));

        res.status(200).json({ success: true, orders: ordersWithProductDetails });

    } catch (error) {
        if (Array.isArray(error.errors)) {
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        } else {
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.message });
        }
    }
};