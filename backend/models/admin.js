import { DataTypes } from 'sequelize';
import sequelize from '../connection/connect.js';
import {v4 as uuidv4} from 'uuid';

const Admin = sequelize.define('admin', {
    id : {
        type : DataTypes.STRING,
        primaryKey : true,
        allowNull : false,
        unique : true,
        defaultValue : uuidv4()
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
    tokens : {
        type : DataTypes.TEXT,
        defaultValue : "[]"
    }
});

export default Admin;