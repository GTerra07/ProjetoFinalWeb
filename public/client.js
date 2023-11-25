document.addEventListener('DOMContentLoaded', function() {
    const addNoteButton = document.getElementById('addNote');
    const editNoteButton = document.getElementById('editNote');

    
    function addNoteToDisplay(note) {
        const noteListElement = document.getElementById('noteList');
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.setAttribute('data-note-id', note.id);
        noteElement.innerHTML = `
            <h4>${note.title}</h4>
            <p>ID: ${note.id}</p>
            <p>${note.description}</p>
            <button class="delete-note" onclick="deleteNote('${note.id}')">X</button>
        `;
        noteListElement.appendChild(noteElement);
    }
    
    if (addNoteButton) {
        addNoteButton.addEventListener('click', function() {
            const title = document.getElementById('noteTitle').value;
            const id = document.getElementById('noteId').value;
            const description = document.getElementById('noteDescription').value;

            fetch('/addNote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ title, id, description })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    addNoteToDisplay({ title, id, description });
                    alert('Anotação adicionada com sucesso!');
                } else {
                    alert(data.message || 'Erro ao adicionar anotação!');
                }
            })
            .catch(error => {
                console.error('Erro ao adicionar anotação:', error);
                alert('Erro ao adicionar anotação!');
            });
        });
    }
    
    function editNoteInDisplay(id, updatedNote) {
        const noteElements = document.querySelectorAll('.note');
        noteElements.forEach(noteElement => {
            if (noteElement.querySelector('p').textContent.includes(`ID: ${id}`)) {
                noteElement.querySelector('h4').textContent = updatedNote.title;
                noteElement.querySelectorAll('p')[1].textContent = updatedNote.description;
            }
        });
    }
    
    if (editNoteButton) {
        editNoteButton.addEventListener('click', function() {
            const id = document.getElementById('editNoteId').value;
            const title = document.getElementById('editNoteTitle').value;
            const description = document.getElementById('editNoteDescription').value;

            fetch('/editNote', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id, title, description })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    editNoteInDisplay(id, { title, description });
                    alert('Anotação alterada com sucesso!');
                } else {
                    alert(data.message || 'Erro ao alterar anotação!');
                }
            })
            .catch(error => {
                console.error('Erro ao alterar anotação:', error);
                alert('Erro ao alterar anotação!');
            });
        });
    }
});

document.getElementById('realizarLogin').addEventListener('click', function() {
    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'products.html';
        } else {
            alert('Login falhou!');
        }
    });
});

document.getElementById('realizarCadastro').addEventListener('click', function() {
    const email = document.getElementById('cadastroEmail').value;
    const senha = document.getElementById('cadastroSenha').value;
    const nome = document.getElementById('cadastroNome').value;
    const dataNascimento = document.getElementById('cadastroDataNascimento').value;

    fetch('/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha, nome, dataNascimento }),
    })
    .then(response => {
        if (response.ok) {
            alert('Cadastro realizado com sucesso!');
        } else {
            alert('Cadastro falhou!');
        }
    });
});

function deleteNote(noteId) {
    fetch(`/deleteNote/${noteId}`, { method: 'DELETE' })
    .then(response => {
        if (response.ok) {
            alert('Anotação excluída com sucesso!');            
            document.querySelector(`[data-note-id="${noteId}"]`).remove();
        } else {
            alert('Erro ao excluir anotação!');
        }
    })
    .catch(error => {
        console.error('Erro ao excluir anotação:', error);
        alert('Erro ao excluir anotação!');
    });
}
