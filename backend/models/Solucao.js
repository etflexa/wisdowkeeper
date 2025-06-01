const mongoose = require('mongoose');

const SolucaoSchema = new mongoose.Schema({
  titulo: String,
  descricao: String,
  categoria: String,
  linkp: String,
  linkv: String,
});

module.exports = mongoose.model('Solucao', SolucaoSchema);
