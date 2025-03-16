/** Imports */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CadastrarUserRoute = require("./routes/CadastrarUserRoute");
const app = express();
const cors = require('cors');
//import argon2 from 'argon2';
const argon2 = require('argon2');

// Config JSON response
app.use(express.json()); // Correção: chamar a função express.json()

//Models
const User = require('./models/User')

// Middleware para manter o servidor ativo
const keepAliveMiddleware = (req, res, next) => {
  // Verifica se a requisição é para o endpoint de keep-alive
  if (req.path === '/keep-alive') {
      return res.status(200).send('Server is alive');
  }

  // Se não for, passa para o próximo middleware
  next();
};

// Aplica o middleware
app.use(keepAliveMiddleware);

// Open Route - Public Route
app.get("/",checkToken, (req, res) => {
  console.log("teste com token concluido");
  res.status(200).json({ msg: "Bem-vindo à nossa API!" });
});

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  

  //checa se o usuário existe
  const user = await User.findById(id, '-password')

  if(!user) {
    return res.status(404).json({msg: 'Usuário não encontrado'})
  }
  res.status(200).json({ user })
})

function checkToken(req, res, next) {


  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado!' })
  }

  try {
    const secret = process.env.SECRET // Confirme se está correto
   

    jwt.verify(token, secret)
    next()
  } catch (error) {
    console.log('Erro ao verificar token:', error.message)
    res.status(400).json({ msg: 'Token Inválido!' })
  }
}


app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Register User
app.use(CadastrarUserRoute);

//retorna a lista de usuarios
app.get('/getUsers', checkToken, async (req,res)=>{
  try {
    const users = await User.find({}, 'nome email perfil'); // Busca todos os usuários no banco de dados
    res.json(users); // Retorna a lista de usuários em formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter os usuários', error: err });
  }

})



//Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log("o email e",email);
  console.log("a senha e", password);

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  //verifica se o usuário existe
  const user = await User.findOne({ email: email })

  if(!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado!' });
  }
  const crypto = require('crypto');


// Função para verificar se a senha fornecida corresponde ao hash armazenado


 //const checkPassword = await bcrypt.compare(String(password), user.password);
 const comparePassword = (param1, param2) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(param1, param2, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });

//const passwordMatches = await comparePassword(String(password), String(user.password));
const passwordMatches =  String(user.password)  ===  String(password)  ? true : false;



 
  

  
if( !passwordMatches) {
  console.log("senha invalida");
  return res.status(422).json({ msg: 'Senha inválida' })
}


  try {
    const secret = process.env.SECRET
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      { expiresIn: '3m' }
    )
    console.log("passou tudo, o token é ", token );
    res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: 'Ocorreu um erro no servidor. Tente novamente mais tarde!'})
  }
})

app.post('/removeUser', checkToken, async (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: "O campo 'email' é obrigatório." });
  }

  try {
      // Verifica se o usuário existe
      const usuario = await User.findOne({ email });

      if (!usuario) {
          return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Remove o usuário
      await User.deleteOne({ email });
      

      return res.status(200).json({ message: "Usuário removido com sucesso." });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao tentar remover o usuário." });
  }
});


// Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.svlhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Conectado ao banco!");
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  })
  .catch((err) => console.log("Erro ao conectar ao banco:", err));
