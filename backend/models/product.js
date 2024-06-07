import { DataTypes } from 'sequelize';
import sequelize from '../connection/connect.js';
import { v4 as uuidv4 } from 'uuid';

const Product = sequelize.define("product", {
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },
    productName : {
        type : DataTypes.STRING,
        allowNull : false
    },
    price : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    quantity : {
        type : DataTypes.INTEGER,
        allowNull : false,
        defaultValue : 1
    },
    description : {
        type : DataTypes.STRING,
        defaultValue : "No description is available for this product"
    },
    imageUrl : {
        type : DataTypes.STRING,
        defaultValue : "Missing image link"
    },
    adminId : {
        type : DataTypes.STRING,
        references: {
            model: 'admins',
            key: 'id'
        }
    }
}, {
    hooks: {
        beforeValidate: (product, options) => {
            product.id = uuidv4();
        }
    }
});

export default Product;
