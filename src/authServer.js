import express from "express";
import bodyParser from "body-parser";
import initWebRouter from './route/auth';
import connectDB from './config/connectDB'
import cors from 'cors';
require('dotenv').config();
//cau hinh de chay process.env

let app = express();
app.use(cors({origin:true}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended:true}));
initWebRouter(app);
connectDB(app);

let port = process.env.AUTH_PORT || 6969;
//lay gia trij trong env (port == undefined => 6969)
app.listen(port, () => {
    console.log("backend nodejs is runing on the port:" + port)
})