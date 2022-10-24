require('dotenv').config();
import { reject, transform } from 'lodash';
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Acira" <minhhieu030920@gmail.com>',
        to: dataSend.reciverEmail,
        subject: "Thong tin dat lich kham benh",
        html:getBodyHTMLEmail(dataSend),
    });
}
let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi'){
        result = `
        <h3> Xin Chao ${dataSend.patientId}</h3>
        <p>Ban nhan duoc Email nay vi da dat lich kham benh tren trang website cua chung toi</p>
        <p>Thong tin dat lich kham benh</p>
        <div><b>Thoi gian: ${dataSend.time}</b></div>
        <div><b>Bac si: ${dataSend.doctorName}</b></div>
        <p>Neu thong tin tren la dung vui long click vao duong link duoi day de xac thuc viec dat lich kham benh.</p>
        <div>
            <a href = ${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Xin tran thanh cam on !</div>
        `
    }
    if (dataSend.language === 'en'){
        result = `
        <h3> Dear ${dataSend.patientId}</h3>
        <p>You received this email because you booked an online medical </p>
        <p>Information to schedule an appointment:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If above information is true, please click on link below to confirm.</p>
        <div>
            <a href = ${dataSend.redirectLink} target="_blank">Click here</a>
        </div>

        <div>Sincerely thank !</div>
        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    console.log(dataSend)
    let result = ''
    if (dataSend.language === 'vi'){
        result = 
        `
        <h3>Xin chao ${dataSend.patientName} !</h3>
        <p>Ban nhan duoc email nay vi da dat lich kham benh online tren Booking care</p>
        <p>Thong tin don thuoc/hoa don duoc gui trong file dinh kem</p>
        <div>Xin chan thanh cam on!</div>
        `
    }
    if (dataSend.language === 'en'){
        result = 
        `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because you booked an online medical appointment on the Booking care</p>
        <p>Infor</p>
        <div>Sincerely thank !</div>
        `
    }

    return result;
}

let sendAttachment = async(dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });
            let info = await transporter.sendMail({
                from: '"Acira" <minhhieu030920@gmail.com>',
                to: dataSend.email,
                subject: "Ket qua dat lich kham benh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy -${dataSend.patientId}-${new Date().getTime()}.jpg`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });
            resolve(true)
        }catch (e){
            reject(e);
        }
    })
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment:sendAttachment
}