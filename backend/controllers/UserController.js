const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserController = {
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await User.find({}, 'nome email perfil ativo');
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao obter usuários' });
    }
  },

  async cadastrarUser(req, res) {
    const { nome, email, cpf, perfil, rua, numero, bairro, cidade, estado, senha } = req.body;

    try {
      const existeEmail = await User.exists({ email });
      if (existeEmail)
        return res.status(422).json({ msg: `O e-mail ${email} já está cadastrado.` });

      const existeCPF = await User.exists({ cpf });
      if (existeCPF)
        return res.status(433).json({ msg: `O CPF ${cpf} já está cadastrado.` });

      const passwordHash = await bcrypt.hash(senha, 10);

      const user = new User({
        nome,
        email,
        cpf,
        perfil,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        password: passwordHash,
        ativo: true,
      });

      await user.save();
      res.status(201).json({ msg: 'Usuário criado com sucesso!' });
    } catch (err) {
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  },

async editarUsuario(req, res) {
  const { cpf, nome, email, perfil, rua, numero, bairro, cidade, estado, senha } = req.body;

  try {
    const usuario = await User.findOne({ cpf });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const existe = await User.exists({ email });
    if (existe && email !== usuario.email) {
      return res.status(422).json({ msg: `O e-mail ${email} já está cadastrado.` });
    }

    if (senha) usuario.password = senha;

    usuario.nome = nome;
    usuario.email = email;
    usuario.perfil = perfil;
    usuario.rua = rua;
    usuario.numero = numero;
    usuario.bairro = bairro;
    usuario.cidade = cidade;
    usuario.estado = estado;

    await usuario.save();
    res.status(200).json({ mensagem: 'Usuário atualizado com sucesso', usuario });
  } catch (erro) {
    res.status(500).json({ mensagem: 'Erro ao atualizar usuário' });
  }
},


  async removerUsuario(req, res) {
    const { email } = req.body;
    try {
      const usuario = await User.findOne({ email });
      if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado.' });

      usuario.ativo = false;
      await usuario.save();
      res.json({ msg: 'Usuário removido com sucesso.' });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao tentar remover o usuário.' });
    }
  },

  async ativarUsuario(req, res) {
    const { email } = req.body;
    try {
      const usuario = await User.findOne({ email });
      if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado.' });

      usuario.ativo = true;
      await usuario.save();
      res.json({ msg: 'Usuário ativado com sucesso.' });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao tentar ativar o usuário.' });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    console.log('Dados recebidos:', email, password);

    if (!email || !password)
      return res.status(422).json({ msg: 'Email e senha são obrigatórios' });

    try {
      const user = await User.findOne({ email });
      if (!user || !user.ativo) return res.status(404).json({ msg: 'Usuário não encontrado!' });
    const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) return res.status(422).json({ msg: 'Senha inválida' });

      const secret = process.env.SECRET;
      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '10m' });

      res.json({ msg: 'Autenticação realizada com sucesso!', token });
    } catch (err) {
      res.status(500).json({ msg: 'Erro no servidor' });
    }
  },

  async buscarUsuarioPorEmail(req, res) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: 'O email é obrigatório.' });

    try {
      const usuario = await User.findOne({ email });
      if (!usuario) return res.status(404).json({ msg: 'Usuário não encontrado.' });

      res.json({
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        perfil: usuario.perfil,
        rua: usuario.rua,
        numero: usuario.numero,
        bairro: usuario.bairro,
        cidade: usuario.cidade,
        estado: usuario.estado,
        ativo: usuario.ativo,
      });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao buscar usuário.' });
    }
  },
};

module.exports = UserController;
