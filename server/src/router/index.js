import express from 'express';
import auth from './auth';

import UsuarioController from '../controller/usuario';
const usuarioController = new UsuarioController();

const router = express.Router()

router.get('/', (req, res, next) => res.send({ ok: true }));

router.post('/usuario', usuarioController.cadastrar);
router.post('/login', usuarioController.login);
router.get('/usuario/:id', auth.required, usuarioController.get)
router.put('/usuario/:id', auth.required, usuarioController.update)
router.get('/usuario/:id/agendamento', auth.required, usuarioController.agendamento)

router.get('/cadeiras')
router.get('/cadeira/:id/agendamentos')
router.get('/cadeira/:id')
router.get('/cadeira/:id/servicos')

router.post('/servico')
router.get('/servico/:id')
router.put('/servico/:id')
router.delete('/servico/:id')

router.post('/cadeira')
router.put('/cadeira/:id')
router.delete('/cadeira/:id')

router.post('/agendamento')
router.get('/agendamento/:id')
router.delete('/agendamento/:id')

export default router;