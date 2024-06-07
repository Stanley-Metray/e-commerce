import AppRouter from '../routes/app-router.js';
import UserRouter from '../routes/user-routes.js';
import AdminRouter from '../routes/admin-routes.js';
import ProductRouter from '../routes/product-routes.js';
import OrderRouter from '../routes/order-routes.js';
import ShopRouter from '../routes/shop-router.js';
import Admin from '../models/admin.js';
import User from '../models/user.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

export const configApp = (app) => {

    Admin.hasMany(Product);
    Product.belongsTo(Admin);

    User.hasMany(Order);
    Order.belongsTo(User);

    app.use(AppRouter);
    app.use(AdminRouter);
    app.use(UserRouter);
    app.use(ProductRouter);
    app.use(OrderRouter);
    app.use(ShopRouter);
}