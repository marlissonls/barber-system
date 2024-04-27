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

router.get('/', (req, res) => res.status(200).json({ ok: true }))

router.post('/register', usuarioController.register)
router.post('/login', usuarioController.login)
router.get('/usuario/:id', auth.required, usuarioController.get)
router.put('/usuario/:id', auth.required, usuarioController.update)
router.delete('/usuario/:id', auth.required, usuarioController.remove)
router.get('/verifica-tipo', auth.verificaTipo)

router.post('/cadeira', auth.required, cadeiraController.register)
router.get('/cadeiras', auth.required, cadeiraController.getAll)
router.get('/cadeira/:id', auth.required, cadeiraController.getServicos)
router.put('/cadeira/:id', auth.required, cadeiraController.update)
router.delete('/cadeira/:id', auth.required, cadeiraController.remove)

router.post('/servico', auth.required, servicoController.register)
router.get('/servico/:id', auth.required, servicoController.get)
router.put('/servico/:id', auth.required, servicoController.update)
router.delete('/servico/:id', auth.required, servicoController.remove)

router.post('/agendamento', auth.required, agendamentoController.register)
router.get('/agendamento/cliente/:userId', auth.required, agendamentoController.usuarioAgendamentos)
router.get('/agendamento/barbeiro/:userId', auth.required, agendamentoController.cadeiraAgendamentos)
router.put('/agendamento/concluir/:id', auth.required, agendamentoController.concluir)
router.put('/agendamento/cancelar/:id', auth.required, agendamentoController.cancelar)
router.delete('/agendamento/:id', auth.required, agendamentoController.remove)

export default router;