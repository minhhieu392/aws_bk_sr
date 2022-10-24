import res from 'express/lib/response';
import db from '../models/index';
import userService from '../services/userService'
const jwt = require('jsonwebtoken');
const logEvents = require('../helpers/logEvents');
const {v4: uuid} = require('uuid')

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if(!email || !password){
        return res.status(200).json({
            errCode: 1,
            message: 'Missing inputs parameter !'
        })
    }else{
        let userData = await userService.handleUserLogin(email, password);
        var datatoken = userData.user;
        let resData =await userService.tokencreate(datatoken)
        console.log('acc1', resData.accessToken)
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            token1: resData.accessToken,
            token2: resData.refreshToken,
            user: userData.user ? userData.user : {},
    })
    }
    
}
 let handleGetAllUser = async (req, res) => {
     let id = req.query.id; // All(lay tat ca) , id(lay 1 nguoi dung)
     if(!id){
        const errMessage = "Missing required parameter !"
        logEvents(`${uuid()}---${req.url}---${req.method}---${errMessage}`)
        return res.status(200).json({ 
            errCode:1,
            errMessage: errMessage,
            user:[],
            
        })     }
     let user = await userService.getAllUser(id);
     return res.status(200).json({ 
         errCode:0,
         user})
 }  

let handleCreateNewUser = async(req, res) => {
    if (!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName){

        return res.status(200).json({
            errCode:0,
            message: 'Missing required parameter !'
        })
    } 
    let message = await userService.CreateNewUser(req.body)
    return res.status(200).json(message);
}
let handleDeleteUser = async(req, res) => {
    if(!req.body.id) {
        return res.status(200).json({
            errCode:1,
            errMessage:"missing required parameeters!"
        })
    }
    let message = await userService.deleteUser(req.body.id)
    return res.status(200).json(message);
}
let handleEditUser = async(req, res) => {
    let data = req.body;
    let allUsers = await userService.updateUserData(data);
    return res.status(200).json(allUsers);
}

let getAllCode = async(req, res) => {
    try {
        
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    }catch (e) {
        console.log('get all code errCode',e)
        return res.status(200).json({
            errCode:-1,
            errMessage:"Error from server"
        })
    }
}
let handleToken = async(req, res) => {
    await userService.tokencreate(datatoken)
    return res.status(200).json({
        errCode: resData.errCode,
        message: resData.errMessage,
        token1: resData.accessToken,
        token2: resData.refreshToken,
        user: resData.user ? userData.user : {}
    });
}

let handleLogout = async(req, res) => {
    try{
        let user = db.User.update({
            refreshToken : ''
        }, {where: {id: req.body.id}});
        return('ok')
    }catch(e){
        console.log(e)
    }
}
    

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser:handleGetAllUser,
    handleCreateNewUser:handleCreateNewUser,
    handleEditUser:handleEditUser,
    handleDeleteUser:handleDeleteUser,
    getAllCode:getAllCode,
    handleToken:handleToken,
    handleLogout:handleLogout
}