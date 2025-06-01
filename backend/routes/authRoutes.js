const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.use(express.urlencoded({ extended: true }));
// Cadastro e Login não precisam de autenticação
router.post('/cadastro', UserController.cadastrarUser);
router.post('/login', UserController.login);

module.exports = router;
