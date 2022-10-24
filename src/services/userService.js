import db from "../models/index";
import bcrypt from 'bcryptjs';
import res from "express/lib/response";
// import { where } from "sequelize/types";
const salt = bcrypt.genSaltSync(10);
require('dotenv').config()
const jwt = require('jsonwebtoken')

let tokencreate = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let resData = {};
            const tokens = await generateTokens(data)
            updateRefreshToken(data.id, tokens.refreshToken)
            resData.errCode = 0;
            resData.errMessage = 'ok';
            resData.accessToken = tokens.accessToken;
            resData.refreshToken = tokens.refreshToken;
            resData.user = data;
            console.log("acc", resData.accessToken )
            resolve(resData)
        }catch (e){
            reject(e)
        }
    })
}

let tokenService  = async (data) => {
    const refreshToken = data.refreshToken
    if(!refreshToken) res.sendStatus(401)
    const tokens = await db.User.findOne({
        where: {refreshToken: refreshToken}
    })
    if(!tokens) return res.sendStatus(403)

    try{
        jwt.verify(refreshToken, process.env.REFESH_TOKEN_SECRET)
        const token = generateTokens(tokens)
        updateRefreshToken(tokens.email, tokens.refreshToken)
        res.json(token)
    }catch(e){
        console.log(e)
        res.sendStatus(403)
    }
}

const generateTokens =  payload => {
    const {id, email} = payload
    const accessToken = jwt.sign({id, email}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30s'
    });
    const refreshToken = jwt.sign({id, email}, process.env.REFESH_TOKEN_SECRET, {
        expiresIn: '1h'
    });
    return {accessToken, refreshToken}
}
let updateRefreshToken =(id, refreshToken) => {
    return new Promise(async(resolve, reject) => {
        console.log("data", id)
        try {
            let user = await db.User.update({
                refreshToken : refreshToken
                // where: { id:id }
            },{ where: { id:id }} )
            // if (user) {
            //         console.log("token", refreshToken)
            //         user.refreshToken = refreshToken
            //         await user.save().then(console.log('1'));
            //     resolve(user);
            // } else {
            //     resolve();
            // }
            resolve(user);

        } catch (err) {
            reject(err);
        }
    })
}

// const updateRefreshToken = async(email, refreshToken) => {
//     return new Promise(async(resolve, reject) => {
//         try{
//             let users  = await db.User.findOne({
//                 where: {email: email}
//             })
//             console.log("hihi",users)
//             users.refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkbWhAZ21haWwuY29tIiwiaWF0IjoxNjU3OTAxNjM1LCJleHAiOjE2NTc5MDUyMzV9.SHrcK5cqhHv-enmJ2zjGG5ZRPiMAugRL2Mboj9-E60Q";
//             await users.save();
//             resolve(users)
//         }catch(e){
//             reject(e)
//         }
         
//     })
// }

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (err) {
            console.error(err)
        }
    })
}
let handleUserLogin = (email, password) => {
    return new Promise( async(resolve, reject) => {
        try{
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                let user = await db.User.findOne({
                    //các trường được phép lấy
                    attributes: ['id','email','roleId','password', 'firstName', 'lastName'],
                    where: {email: email},
                    raw: true                     
                });
                if(user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'ok';
                        delete user.password;
                        userData.user = user;
                    }
                    else{
                        userData.errCode = 3;
                        userData.errMessage = 'wrong password';
                    }
                }else{
                    userData.errCode = 2;
                    userData.errMessage = 'user is not found'
                }

            }else{
                userData.errCode = 1;
                userData.errMessage = "your's Email isn't exist in your system. plz try other email!"
                
            }
            resolve(userData)
        }catch(err){
           
            reject(err);
        }
    })
}

let checkUserEmail = (Useremail) => {
    return new Promise(async(resolve, reject) => {
        try{
            console.log(Useremail)
            let user = await db.User.findOne({
                where: {email: Useremail}
            })
            if(user) {
                resolve(true)
            }else{

                resolve(false)}
        }catch(err){
            reject(err);
        }
    })
}

let getAllUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let users = '';
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude:['password', 'image']
                    }
                })
            }if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude:['password']
                    }
                })
            }
            resolve(users)
            
        }catch(err){
            reject(err);
        }
    })
}
let CreateNewUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            //check email is exist
            let checkemail = await checkUserEmail(data.email);
            if(checkemail === true){
                resolve({
                    errCode:1,
                    errMessage: 'Your email is already in user'
                })
            }else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    phonenumber: data.phonenumber,
                    positionId: data.positionId,
                    image: data.avatar
            })
            resolve({
                errCode: 0,
                message:'OK'   
            })
            }
            
        }catch(err){
            reject(err);
        }
    })
}

let deleteUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        let user = await db.User.findOne({
            where: {id:userId}
        })
        if(!user) {
            resolve({errCode: 2, message:'the user is not exist'})
        }
        // await user.destroy();
       
        await db.User.destroy({
            where: {id:userId},
        })
        resolve({errCode: 0, message:'the user is deleted'})
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if(!data.id || !data.roleId || !data.positionId || !data.gender){
                resolve({errCode: 2, message:'missing required parameter'})
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false, 
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = user.phonenumber
                user.roleId = data.roleId;
                user.positionId= data.positionId;
                user.gender= data.gender;

                if (data.avatar){
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: 'update the user succeeds!'
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User is not found!'
                });
            }

        }catch(err){
            reject(err)
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(!typeInput){
                resolve({
                    errCode:1,
                    errMessage: 'Missing required parameters'
                });
            }else{
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: {type: typeInput}
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
            
            
        }catch(e){
            reject(e);
        }
    })
}

module.exports ={
    handleUserLogin:handleUserLogin,
    getAllUser:getAllUser,
    CreateNewUser:CreateNewUser,
    deleteUser:deleteUser,
    updateUserData:updateUserData,
    getAllCodeService:getAllCodeService,
    // tokenService:tokenService
    tokencreate : tokencreate
}