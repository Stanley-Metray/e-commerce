import {Router} from 'express';
import { getRegistration, postRegister, getLoginAdmin, postLoginAdmin } from '../controllers/admin-controller.js';

const AdminRouter = Router();

AdminRouter.get('/admin/register', getRegistration);

AdminRouter.post('/admin/register', postRegister);

AdminRouter.get('/admin/login', getLoginAdmin);

AdminRouter.post('/admin/login', postLoginAdmin);

export default AdminRouter;