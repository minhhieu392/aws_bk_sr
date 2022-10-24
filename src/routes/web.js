import express from "express";
import userControler from "../controllers/userControler";
import doctorController from "../controllers/doctorController";
import homeController from "../controllers/homeController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from '../controllers/clinicController';
import verifyToken from "../middleware/auth";
let router = express.Router();
//rest api 
let initWebRouters = (app) => {

    router.get('/', homeController.getHomePage);

    router.post('/api/login', userControler.handleLogin);
    router.post('/api/signUp', userControler.handleCreateNewUser);

    router.get('/about', homeController.getAboutPage);
    router.post('/createuser', homeController.createuser);
    router.get('/get-crud', homeController.displaygetCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    router.get('/api/get-all-user',userControler.handleGetAllUser);
    router.post('/api/create-new-user', userControler.handleCreateNewUser);
    router.put('/api/edit-user', userControler.handleEditUser);
    router.delete('/api/delete-user', userControler.handleDeleteUser);

    router.get('/api/allcode', userControler.getAllCode);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome);

    router.get('/api/get-all-doctor', doctorController.getAllDoctors);

    router.post('/api/save-infor-doctors', doctorController.postInforDoctors);

    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    
    router.get('/api/get-special-top', doctorController.getSpecialTop);

    router.get('/api/get-special-detail', doctorController.getDetailSpecial);
    
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleByDate);

    router.get('/api/get-extra-infor-doctor-by-id',doctorController.getExtraInforDoctorById);

    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);

    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createSpecialty);

    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createClinic);

    router.get('/api/get-clinic', clinicController.getAllClinic);

    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    router.get('/api/get-list-patient-for-doctor', doctorController.getListPatientForDoctor);

    router.post('/api/send-remedy', doctorController.sendRemedy);

    return app.use("/", router)
}
module.exports = initWebRouters