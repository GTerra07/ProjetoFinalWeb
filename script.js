const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

let users = [];

// Carrega os dados do arquivo JSON ao iniciar o servidor
fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao carregar dados do JSON:', err.message);
        return;
    }
    users = JSON.parse(data);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function cadastrarUsuario(email, senha, nome, dataNascimento) {
    // Adicionar lógica de validação e cadastro do usuário aqui
    const novoUsuario = { email, senha, nome, dataNascimento };
    users.push(novoUsuario);
    console.log('Novo usuário cadastrado:', novoUsuario);

    // Atualiza o arquivo JSON com os novos dados
    fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Erro ao salvar dados no JSON:', err.message);
        } else {
            console.log('Dados do JSON atualizados com sucesso.');
        }
    });
}

function validarLogin(email, senha) {
    // Adicionar lógica de validação do login aqui
    const usuario = users.find(user => user.email === email && user.senha === senha);
    return usuario !== undefined;
}

// Adicionar lógica de cadastro aqui
console.log('Cadastro de usuário via Node.js');

// Adicionar lógica de cadastro aqui
app.post('/cadastro', (req, res) => {
    const email = req.query.email;
    const senha = req.query.senha;
    const nome = req.query.nome;
    const dataNascimento = req.query.dataNascimento;

    console.log('Recebendo requisição de cadastro:', email, senha, nome, dataNascimento);

    if (!email || !senha || !nome || !dataNascimento) {
        res.status(400).send('Todos os campos são obrigatórios.');
        return;
    }

    const usuarioExistente = users.find(user => user.email === email);
    if (usuarioExistente) {
        res.status(409).send('Este email já está cadastrado. Utilize outro.');
        return;
    }

    cadastrarUsuario(email, senha, nome, dataNascimento);
    res.status(201).send('Cadastro realizado com sucesso!');
});


// Adicionar lógica de login aqui
app.post('/login', (req, res) => {
    const email = req.query.email;
    const senha = req.query.senha;

    if (!email || !senha) {
        res.status(400).send('Email e senha são obrigatórios.');
        return;
    }

    if (validarLogin(email, senha)) {
        res.status(200).send('Login bem-sucedido!');
    } else {
        res.status(401).send('Credenciais inválidas. Verifique seu email e senha.');
    }
});
