const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: String,
  email: String,
  cpf: String,
  perfil: String,
  rua: String,
  numero: String,
  bairro: String,
  cidade: String,
  estado: String,
  password: String,
  ativo: Boolean,
});

module.exports = mongoose.model('User', UserSchema);
