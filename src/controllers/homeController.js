import db from '../models/index';
import CRUDService from '../services/CRUDService'

let getHomePage = async(req, res) => {
    try {
        let data = await db.User.findAll();
        console.log(data);
        return res.render('homepage.ejs', {
            data: JSON.stringify({})
        });
    } catch (err) {
        console.log(err);
    }
}
let getAboutPage = (req, res) => {
    return res.render('test/aboutpage.ejs');
}
let createuser = async(req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.render('test/aboutpage.ejs');

}
let displaygetCRUD = async(req, res) => {
    let data = await CRUDService.getAlluser();
    //console.log(data);
    return res.render('homepage.ejs', {
        dataTable: data
    });
}
let getEditCRUD = async(req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userdata = await CRUDService.getUserInfoById(userId);
        console.log(userdata);
        return res.render('editCRUD.ejs', {
            user: userdata
        });
    } else {
        return res.send('error');
    }

}
let putCRUD = async(req, res) => {
    let data = req.body;
    await CRUDService.updateUser(data);
    return res.redirect('/get-crud');
}
let deleteCRUD = async(req, res) => {
    let userid = req.query.id;
    await CRUDService.deleteUser(userid);
    return res.send('delete succefuly');
}
module.exports = {
    getHomePage:getHomePage,
    getAboutPage: getAboutPage,
    createuser: createuser,
    displaygetCRUD: displaygetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}