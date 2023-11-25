const express = require('express');
const router = express.Router();
const userController = require('./controllers');
const noteController = require('./notesController');

// Rota para cadastro de usuário
router.post('/cadastro', userController.cadastrarUsuario);

// Rota para login de usuário
router.post('/login', userController.validarLogin);

// Rota para adicionar uma anotação
router.post('/addNote', noteController.addNote);

// Rota para alterar uma anotação
router.post('/editNote', noteController.editNote);

// Rota para listar todas as anotações
router.get('/notes', noteController.listNotes);

// Rota para excluir uma anotação
router.delete('/deleteNote/:id', noteController.deleteNote);


module.exports = router;
