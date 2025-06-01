const Solucao = require('../models/Solucao');

const SolucaoController = {
  async cadastrarSolucao(req, res) {
    const { titulo, descricao, categoria, linkp = 'null', linkv = 'null' } = req.body;

    if (!titulo || !descricao || !categoria) {
      return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
    }

    try {
      const novaSolucao = new Solucao({ titulo, descricao, categoria, linkp, linkv });
      await novaSolucao.save();
      res.status(201).json({ msg: 'Solução cadastrada com sucesso!', novaSolucao });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao cadastrar a solução.' });
    }
  },

  async getSolucaoById(req, res) {
    const { id } = req.body;
    try {
      const solucao = await Solucao.findById(id);
      if (!solucao) return res.status(404).json({ msg: 'Solução não encontrada.' });
      res.json(solucao);
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao buscar a solução.' });
    }
  },

  async getSolucoes(req, res) {
    try {
      const solucoes = await Solucao.find({}, '_id titulo categoria');
      res.json(solucoes);
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao obter as soluções' });
    }
  },

  async removerSolucao(req, res) {
    const { _id } = req.body;
    if (!_id) return res.status(400).json({ msg: "O campo '_id' é obrigatório." });

    try {
      const solucao = await Solucao.findById(_id);
      if (!solucao) return res.status(404).json({ msg: 'Solução não encontrada.' });

      await Solucao.deleteOne({ _id });
      res.json({ msg: 'Solução removida com sucesso.' });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao remover solução.' });
    }
  },

  async editarSolucao(req, res) {
    const { _id, titulo, descricao, categoria, linkp = 'null', linkv = 'null' } = req.body;

    if (!_id) return res.status(400).json({ msg: "O campo '_id' é obrigatório." });

    try {
      const solucao = await Solucao.findById(_id);
      if (!solucao) return res.status(404).json({ msg: 'Solução não encontrada.' });

      solucao.titulo = titulo || solucao.titulo;
      solucao.descricao = descricao || solucao.descricao;
      solucao.categoria = categoria || solucao.categoria;
      solucao.linkp = linkp;
      solucao.linkv = linkv;

      await solucao.save();
      res.json({ msg: 'Solução atualizada com sucesso.', solucao });
    } catch (err) {
      res.status(500).json({ msg: 'Erro ao editar solução.' });
    }
  },
};

module.exports = SolucaoController;
