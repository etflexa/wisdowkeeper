const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const solucaoRoutes = require('./routes/solucaoRoutes');

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', solucaoRoutes);

module.exports = app;
