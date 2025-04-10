const mongoose = require('mongoose')

const Solucao = mongoose.model('Solucao', {
    titulo: String,
    descricao: String,
    categoria: String,
    linkp: String,
    linkv: String
})

module.exports = Solucao