const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const checkToken = require('../middlewares/authMiddleware');

router.get('/usuarios', checkToken, UserController.getUsers);
router.get('/usuario/:id', checkToken, UserController.getUserById);

router.post('/editarUsuario', checkToken, UserController.editarUsuario);
router.post('/removerUsuario', checkToken, UserController.removerUsuario);
router.post('/ativarUsuario', checkToken, UserController.ativarUsuario);
router.post('/buscarUsuario', checkToken, UserController.buscarUsuarioPorEmail);

module.exports = router;
