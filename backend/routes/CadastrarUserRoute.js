const express = require("express");
const User = require('../models/User.js');
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");




const router = express.Router();
function checkToken(req, res, next) {


  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' })
  }

  try {
    const secret = process.env.SECRET // Confirme se está correto
    console.log('Token recebido:', token)
    console.log('Secret usado:', secret)

    jwt.verify(token, secret)
    next()
  } catch (error) {
    console.log('Erro ao verificar token:', error.message)
    res.status(400).json({ msg: 'Token Inválido!' })
  }
}

router.post("/cadastro", checkToken, async (req, res) => {
  const { nome,email,cpf,perfil, rua,numero,bairro,cidade,estado, senha}  = req.body;

 const password = senha;
console.log(password);
 // Validations

 const existe = await User.exists({ email });

 if (existe) {
   console.log('Usuário já existe');
   return res.status(422).json({ msg: `O e-mail ${email} já está cadastrado. Utilize outro e-mail` });
 } 

 const cpfExiste = await User.exists({ cpf });

 if (cpfExiste) {
   console.log('Usuário já existe');
   return res.status(433).json({ msg: `O CPF ${cpf} já está cadastrado. Utilize outro CPF` });
 } 
 
   
  //criar senha
  async function gerarHash(senha) {
    const custoDoSalt = 10;
    try {
        const hash = await bcrypt.hash(senha, custoDoSalt);
        return hash;
    } catch (err) {
        console.error('Erro ao gerar hash:', err);
    }
}


  const passwordHash = String(password);

  
  //criar usuário
  const user = new User({
    nome: nome,
    email: email,
    cpf: cpf,
    perfil: perfil,
    rua: rua,
    numero: numero,
    bairro:bairro,
    cidade: cidade,
    estado: estado,
    password: passwordHash,
  })
  try {
    user.save()
   res.status(201).json({msg: "Usuário criado com sucesso!"})
 } catch (error) {
   console.log(error)
   res.status(500).json({msg: 'Ocorreu um erro no servidor. Tente novamente mais tarde!'})
 }

 

 
 

});

module.exports = router;
