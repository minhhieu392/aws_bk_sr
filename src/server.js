import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRouter from './routes/web';
import connectDB from './config/connectDB'
import cors from 'cors';
require('dotenv').config();
//cau hinh de chay process.env

let app = express();
const helmet = require('helmet');
const morgan = require('morgan');

app.use(helmet());
app.use(morgan());

app.use(cors({origin:true}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb', extended:true}));
viewEngine(app);
initWebRouter(app);
connectDB(app);

let port = process.env.PORT || 6969;
//lay gia trij trong env (port == undefined => 6969)
app.listen(port, () => {
    console.log("backend nodejs is runing on the port:" + port)
})