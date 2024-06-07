import {Router} from 'express';
import { verifyToken } from '../controllers/auth-controller.js';
import { postOrder, getOrders, getOrder } from '../controllers/order-controller.js';

const OrderRouter = Router();

OrderRouter.get('/orders', verifyToken, getOrder);
OrderRouter.post('/order', verifyToken, postOrder);
OrderRouter.get('/order/orders', verifyToken, getOrders);

export default OrderRouter;