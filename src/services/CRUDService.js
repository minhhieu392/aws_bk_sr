import bcrypt from 'bcryptjs';
import { raw } from 'body-parser';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);
let createNewUser = async(data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phonenumber: data.phonenumber,
            })
            resolve('ok create a new user succeed!')
        } catch (err) {
            reject(err);
        }
    })

}
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
let getAlluser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
                //loại bỏ _previousDataValues
            });

            resolve(users)
        } catch (err) {
            reject(err)
        }
    })
}
let getUserInfoById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resolve(user)
            } else {
                resolve({})
            }

        } catch (err) {
            reject(err);
        }
    })
}
let updateUser = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstname;
                user.lastName = data.lastname;
                user.address = data.address;
                user.phonenumber = data.phonenumber;

                await user.save();
                resolve(user);
            } else {
                resolve();
            }

        } catch (err) {
            reject(err);
        }
    })
}
let deleteUser = (userid) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userid }
            })
            if (user) {
                await user.destroy();
            }
            resolve(); // = return mà k trả ra kết quả nào

        } catch (err) {
            reject(err);
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAlluser: getAlluser,
    getUserInfoById: getUserInfoById,
    updateUser: updateUser,
    deleteUser: deleteUser
}