const fs = require('fs');
const path = require('path');


function loadUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

async function cadastrarUsuario(req, res) {
    try {
        const users = await loadUsers();
        
        res.status(201).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
}

async function validarLogin(req, res) {
    try {
        const users = await loadUsers();        
        
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
}

module.exports = {
    cadastrarUsuario,
    validarLogin
};
