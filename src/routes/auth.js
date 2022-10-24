import express from "express";
import { route } from "express/lib/application";
// import { verify } from "jsonwebtoken";
import userControler from "../controllers/userControler";
import verifyToken from "../middleware/auth";
// import verifyToken from "../middleware/auth";
let router = express.Router();
let initWebRouters = (app) => {
    router.post('/api/login', userControler.handleLogin);
    router.post('/api/token', userControler.handleToken);
    router.post('/api/logout',verifyToken, userControler.handleLogout);
    return app.use("/", router)
}

module.exports = initWebRouters