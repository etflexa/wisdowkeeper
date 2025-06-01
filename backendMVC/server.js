const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

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
