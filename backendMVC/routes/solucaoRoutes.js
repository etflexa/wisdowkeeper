const express = require('express');
const router = express.Router();
const SolucaoController = require('../controllers/SolucaoController');
const checkToken = require('../middlewares/authMiddleware');

router.post('/cadastrarSolucao', checkToken, SolucaoController.cadastrarSolucao);
router.post('/solucao', checkToken, SolucaoController.getSolucaoById);
router.get('/solucoes', checkToken, SolucaoController.getSolucoes);
router.post('/removerSolucao', checkToken, SolucaoController.removerSolucao);
router.post('/editarSolucao', checkToken, SolucaoController.editarSolucao);

module.exports = router;
