import {Router} from 'express';
import { verifyToken } from "../controllers/auth-controller.js";
import { getShop } from '../controllers/shop-controller.js';

const ShopRouter = Router();

ShopRouter.get('/shop/products', verifyToken, getShop);

export default ShopRouter;