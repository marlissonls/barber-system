import express from "express";

import auth from "../../auth.js";
import validateReq from "../../../validations/validateReq.js";

import userValidation from "../../../validations/user.js";
import chairValidation from "../../../validations/chair.js";
import serviceValidation from "../../../validations/service.js";
import appointmentValidation from "../../../validations/appointment.js";

import UserController from "../../../controller/user.js";
import ChairController from "../../../controller/chair.js";
import ServiceController from "../../../controller/service.js";
import AppointmentController from "../../../controller/appointment.js";

const userController = new UserController();
const chairController = new ChairController();
const serviceController = new ServiceController();
const appointmentController = new AppointmentController();

const router = express.Router();

router.post('/register', validateReq(userValidation.store), userController.store);
router.post('/login', validateReq(userValidation.index), userController.login);
router.get('/usuario/:id', auth, validateReq(userValidation.index), userController.index);
// router.put('/usuario/:id', auth, userController.update);
// router.delete('/usuario/:id', auth, userController.remove);
// router.get('/verifica-tipo', auth.verificaTipo);

// router.post('/cadeira', auth, chairController.store);
router.get('/cadeira', auth, chairController.index);
router.get('/cadeiras', auth, chairController.showAll);
router.get('/cadeira/:id', auth, validateReq(chairValidation.showServices), chairController.showServices);
router.put('/cadeira', auth, validateReq(chairValidation.update), chairController.update);
// router.delete('/cadeira/:id', auth, chairController.remove);

// router.post('/servico', auth, serviceController.register);
router.get('/servico/:id', auth, validateReq(serviceValidation.index), serviceController.index);
// router.put('/servico/:id', auth, serviceController.update);
// router.delete('/servico/:id', auth, serviceController.remove);

router.post('/agendamento', auth, validateReq(appointmentValidation.store), appointmentController.store);
router.get('/agendamento/cliente/:userId', auth, validateReq(appointmentValidation.userAppointments), appointmentController.userAppointments);
router.get('/agendamento/barbeiro/:userId', auth, validateReq(appointmentValidation.barberAppointments), appointmentController.barberAppointments);
router.get('/agendamento/gerente/:cadeiraId/:data', auth, validateReq(appointmentValidation.chairAppointments), appointmentController.chairAppointments);
router.put('/agendamento/concluir/:id', auth, validateReq(appointmentValidation.concludeAppointment), appointmentController.concludeAppointment);
router.put('/agendamento/cancelar/:id', auth, validateReq(appointmentValidation.cancelAppointment), appointmentController.cancelAppointment);
router.delete('/agendamento/:id', auth, validateReq(appointmentValidation.removeAppointment), appointmentController.removeAppointment);

export default router;