import {Router} from 'express';
import { getHome } from '../controllers/app-controller.js';
import {verifyToken} from '../controllers/auth-controller.js';

const AppRouter = Router();

AppRouter.get('/', verifyToken, getHome);

export default AppRouter;