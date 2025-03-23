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
//rota para revalidar o token do usuario
app.post('/refresh', (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.status(400).json({ message: 'Token is required' });
  }

  try {
      // Verifica se o token é válido
      const decoded = jwt.verify(token, process.env.SECRET);

      // Gera um novo token com o mesmo payload e um novo tempo de expiração
      const newToken = jwt.sign(
          { userId: decoded.userId },
          process.env.SECRET,
          { expiresIn: '10m' } // Renova por mais 15 minutos, por exemplo
      );

      res.json({ token: newToken });
  } catch (error) {
      res.status(401).json({ message: 'Invalid or expired token' });
  }
});

//retorna a lista de usuarios
app.get('/getUsers', checkToken, async (req,res)=>{
  try {
    const users = await User.find({}, 'nome email perfil'); // Busca todos os usuários no banco de dados
    res.json(users); // Retorna a lista de usuários em formato JSON
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter os usuários', error: err });
  }

})

// Rota POST para buscar usuário por email
app.post('/buscarUsuario',checkToken, async (req, res) => {
  try {
    // Pega o e-mail do corpo da requisição
    const { email } = req.body;

    // Valida se o e-mail foi fornecido
    if (!email) {
      return res.status(400).json({ mensagem: 'O email é obrigatório.' });
    }

    // Busca o usuário no banco de dados pelo e-mail
    const usuario = await User.findOne({ email });

    // Se o usuário não for encontrado
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    // Retorna os dados do usuário
    return res.status(200).json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      perfil: usuario.perfil,
      rua:usuario.rua,
      numero:usuario.numero,
      bairro:usuario.bairro,
      cidade: usuario.cidade,
      estado: usuario.estado
    });

  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
  }
});

app.put('/editarUsuario',checkToken, async (req, res) => {
  
  const { cpf, nome, email, perfil,rua,numero,bairro,cidade,estado,senha } = req.body; // Pega os dados do corpo da requisição

  try {
    // Encontre o usuário pelo CPF
    const usuario = await User.findOne({ cpf });

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
    const existe = await User.exists({ email });

    if (existe &&(email != usuario.email)) {
      console.log('email já utilizado');
      return res.status(422).json({ msg: `O e-mail ${email} já está cadastrado. Utilize outro e-mail` });
    } 

    // Atualize os campos conforme necessário
    
    
    if (senha) {
      usuario.password = senha; // Atualiza a senha se o campo estiver presente
    }
    usuario.nome=nome;
    usuario.email=email;
    usuario.perfil=perfil;
    usuario.rua=rua;
    usuario.numero=numero;
    usuario.bairro=bairro;
    usuario.cidade=cidade;
    usuario.estado=estado;


    // Salve as alterações no banco de dados
    await usuario.save();

    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
  }
});

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
      { expiresIn: '10m' }
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
