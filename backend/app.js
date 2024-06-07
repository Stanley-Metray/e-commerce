import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { configApp } from './configuration/app-configuration.js';
import sequelize from './connection/connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: ["http://localhost:5000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use();
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/css', express.static(path.join(__dirname, "../frontend/public/css")));
app.use('/js', express.static(path.join(__dirname, "../frontend/public/js")));
configApp(app);


sequelize.sync()
.then(()=>{
        app.listen(5000, (err)=>{
            if(err)
                return console.error(err);
        
            console.log("Server started");
        });
})
.catch((err)=>{
    return console.error(err);
});