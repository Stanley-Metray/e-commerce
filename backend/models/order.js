import { DataTypes } from 'sequelize';
import sequelize from '../connection/connect.js';
import { v4 as uuidv4 } from 'uuid';

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "[]"
    },
    totalPrice : {
        type :DataTypes.DOUBLE,
        defaultValue : 0
    }
}, {
    hooks: {
        beforeValidate: (order, options) => {
            order.id = uuidv4();
        }
    }
});


export default Order;