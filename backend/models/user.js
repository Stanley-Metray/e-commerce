import { DataTypes } from 'sequelize';
import sequelize from '../connection/connect.js';

const User = sequelize.define('user', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true,
        unique : true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    cart : {
        type : DataTypes.JSON,
        defaultValue : []
    },
    tokens : {
        type : DataTypes.JSON,
        defaultValue : []
    }
});

export default User;