import {Router} from 'express';
import { getRegistration, postRegister, getLoginUser, postLoginUser, postCart, getCart ,getCartProducts } from '../controllers/user-controller.js';
import { verifyToken } from '../controllers/auth-controller.js';

const UserRouter = Router();

UserRouter.get('/user/register', getRegistration);

UserRouter.post('/user/register', postRegister);

UserRouter.get('/user/login', getLoginUser);

UserRouter.post('/user/login', postLoginUser);

UserRouter.post('/user/cart', verifyToken, postCart);

UserRouter.get('/user/cart', verifyToken, getCart);

UserRouter.get('/user/cart/products', verifyToken, getCartProducts);

export default UserRouter;