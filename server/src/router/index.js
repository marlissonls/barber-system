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

router.get('/', (req, res, next) => res.send({ ok: true }));

router.post('/usuario', usuarioController.register);
router.post('/login', usuarioController.login);
router.get('/usuario/:id', auth.required, usuarioController.get)
router.put('/usuario/:id', auth.required, usuarioController.update)
router.get('/usuario/:id/agendamento', auth.required, usuarioController.agendamento)

router.get('/cadeiras', cadeiraController.getAll)
router.get('/cadeira/:id/agendamentos', auth.required, cadeiraController.agendamentos)
router.get('/cadeira/:id', cadeiraController.get)
router.post('/cadeira', cadeiraController.register)
router.put('/cadeira/:id', auth.required, cadeiraController.update)
router.delete('/cadeira/:id', auth.required, cadeiraController.remove)

router.post('/servico', auth.required, servicoController.register)
router.get('/servico/:id', auth.required, servicoController.get)
router.put('/servico/:id', auth.required, servicoController.update)
router.delete('/servico/:id', auth.required, servicoController.remove)

router.post('/agendamento')
router.get('/agendamento/:id')
router.delete('/agendamento/:id')

export default router;