import express from 'express';
import auth from './auth.js';

import UsuarioController from '../controller/usuario.js';
import CadeiraController from '../controller/cadeira.js';
import ServicoController from '../controller/servico.js';
import AgendamentoController from '../controller/agendamento.js';

const usuarioController = new UsuarioController();
const cadeiraController = new CadeiraController();
const servicoController = new ServicoController();
const agendamentoController = new AgendamentoController();

const router = express.Router()

router.post('/usuario', usuarioController.register)
router.post('/login', usuarioController.login)
router.get('/usuario/:id', usuarioController.get)
router.put('/usuario/:id', usuarioController.update)
router.delete('/usuario/:id', usuarioController.remove)

router.post('/cadeira', cadeiraController.register)
router.get('/cadeiras', cadeiraController.getAll)
router.get('/cadeira/:id', cadeiraController.getServicos)
router.get('/cadeira/:id/agendamentos', cadeiraController.agendamentos)
router.put('/cadeira/:id', cadeiraController.update)
router.delete('/cadeira/:id', cadeiraController.remove)

router.post('/servico', servicoController.register)
router.get('/servico/:id', servicoController.get)
router.put('/servico/:id', servicoController.update)
router.delete('/servico/:id', servicoController.remove)

router.post('/agendamento', agendamentoController.register)
router.get('/agendamento/:userId', agendamentoController.get)
router.delete('/agendamento/:id', agendamentoController.remove)

export default router;