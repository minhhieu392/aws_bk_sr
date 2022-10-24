import db from "../models/index"
require('dotenv').config();
import emailService from './emailService';
import {v4 as uuidv4} from 'uuid';
import { reject } from "lodash";

let buildUrEmail = (doctorId, token)=> {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve,reject)=>{
        try{
            console.log(data)
            if (!data.email || !data.doctorId || !data.timeType || !data.date || !data.fullName
                || !data.selectedGender || !data.address){
                resolve({
                    errCode: 1,
                    errMessage:'Missing paremeter'
                })
                
            }else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientId: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrEmail(data.doctorId, token)
                })
                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName : data.fullName
                    },
                });
    
                //create a booking record
                if (user && user[0]){
                    await db.Booking.findOrCreate({
                        where: {patientId: user[0].id},
                        defaults: {
                            statusId :'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date ,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succe'
                })
            }
                
        }catch(e){
            reject(e);
        }
    })
    
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            if(!data.token || !data.doctorId){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                console.log(appointment)

                if (appointment){
                    appointment.statusId = 'S2';
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "update the appointment succeed!"
                    })
                }else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointments has been activated of does not exist"
                    })
                }
            }
        }catch (e){
            reject(e);
        }
    })
}
module.exports = {
    postBookAppointment:postBookAppointment,
    postVerifyBookAppointment:postVerifyBookAppointment
}