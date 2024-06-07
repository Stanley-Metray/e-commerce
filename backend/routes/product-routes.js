import {Router} from 'express';
import { verifyToken } from "../controllers/auth-controller.js";
import { postProduct, getProduct, getProducts, updateProduct, deleteProduct } from '../controllers/product-controller.js';

const ProductRouter = Router();

ProductRouter.post('/product', verifyToken, postProduct);
ProductRouter.get('/product/:productId', verifyToken, getProduct);
ProductRouter.get('/products', verifyToken, getProducts);
ProductRouter.get('/products', verifyToken, getProducts);
ProductRouter.put('/product', verifyToken, updateProduct);
ProductRouter.delete('/product/:productId', verifyToken, deleteProduct);

export default ProductRouter;


