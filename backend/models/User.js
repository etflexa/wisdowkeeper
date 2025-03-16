const mongoose = require('mongoose')

const User = mongoose.model('User', {
  nome: String,
  email: String,
  cpf: String,
  perfil: String,
  rua:String,
  numero:String,
  bairro: String,
  cidade: String,
  estado: String,
  password: String,

})

module.exports = User