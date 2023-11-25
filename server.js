const express = require('express');
const path = require('path');
const router = require('./routes');
const app = express();
const port = 3000;

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Usar as rotas definidas em routes.js
app.use(router);

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
