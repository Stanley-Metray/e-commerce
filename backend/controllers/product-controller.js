import Admin from "../models/admin.js";
import User from "../models/user.js";
import Product from "../models/product.js";
import path from 'path';


export const postProduct = async (req, res) => {
    try {
        const adminId = req.body.userId;
        delete req.body.userId;
        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            res.status(404).json({ message: "Admin Access Error", success: false, error: "404 error, Admin not found" });
            return;
        }

        const product = await Product.create({ ...req.body, adminId: adminId });
        if (product)
            res.status(201).json({ success: true, message: "Product Added" });
        else
            res.status(500).json({ success: false, message: "Failed To Add Product" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
}

export const getProduct = async (req, res) => {
    try {

        const user = await User.findByPk(req.body.userId) || Admin.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to authenticate", success: false, error: "404 error, Invalid admin/user" });
            return;
        }

        const product = await Product.findByPk(req.params.productId, {attributes : ["id", "productName", "price", "imageUrl", "description"]});
        if (product)
            res.status(201).json({ success: true, product: product });
        else
            res.status(500).json({ success: false, message: "Failed to get product" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
}

export const getProducts = async (req, res) => {
    try {

        const user = await User.findByPk(req.body.userId) || await Admin.findByPk(req.body.userId);

        if (!user) {
            res.status(404).json({ message: "Failed to authenticate", success: false, error: "404 error, Invalid admin/user" });
            return;
        }

        const products = await Product.findAll({ attributes: ["id", "productName", "imageUrl", "price", "quantity", "description"] });
        if (products)
            res.status(200).json({ success: true, product: products });
        else
            res.status(500).json({ success: false, message: "Failed to get products" });

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
}


export const updateProduct = async (req, res) => {
    try {
        const adminId = req.body.userId;
        const productId = req.body.productId;
        delete req.body.userId;
        delete req.body.productId;

        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            res.status(404).json({ message: "Failed to authenticate", success: false, error: "404 error, Invalid admin/user" });
            return;
        }

        const [affectedRows] = await Product.update(req.body, { where: { id: productId } });

        if (affectedRows > 0) {
            const updatedProduct = await Product.findByPk(productId);
            res.status(201).json({ success: true, product: updatedProduct });
        } else {
            res.status(500).json({ success: false, message: "Failed to update" });
        }


    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const adminId = req.body.userId;
        const productId = req.params.productId;
        delete req.body.userId;
        delete req.body.productId;

        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            res.status(404).json({ message: "Failed to authenticate", success: false, error: "404 error, Invalid admin/user" });
            return;
        }

        const result = await Product.destroy({where : {id : productId}});

        if (result) {
            res.status(200).json({ success: true, message: "Product deleted" });
        } else {
            res.status(500).json({ success: false, message: "Failed to delete" });
        }

    } catch (error) {
        if (Array.isArray(error.errors))
            res.status(500).json({ message: "Internal Server Error", success: false, error: error.errors[0].message });
        else
            res.status(500).json({ message: "Internal Server Error", success: false, error: error });
    }
}
