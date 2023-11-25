const fs = require('fs');
const path = require('path');
const DATA_PATH = path.join(__dirname, 'notes.json');

function readNotes() {
    return new Promise((resolve, reject) => {
        fs.readFile(DATA_PATH, 'utf8', (err, data) => {
            if (err) {
                
                if (err.code === 'ENOENT') {
                    return resolve([]);
                }
                return reject(err);
            }
            try {
                const notes = JSON.parse(data);
                resolve(notes);
            } catch (parseErr) {
                reject(parseErr);
            }
        });
    });
}

function writeNotes(notes) {
    return new Promise((resolve, reject) => {
        fs.writeFile(DATA_PATH, JSON.stringify(notes, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function addNote(req, res) {
    try {
        const { title, id, description } = req.body;
        const notes = await readNotes();
        
        if (notes.some(note => note.id === id)) {
            return res.status(400).json({ success: false, message: 'Uma anotação com esse ID já existe.' });
        }

        notes.push({ title, id, description });
        await writeNotes(notes);
        res.status(201).json({ success: true, message: 'Anotação adicionada com sucesso.', note: { title, id, description } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao processar a sua solicitação.' });
    }
}

async function editNote(req, res) {
    try {
        const { id, title, description } = req.body;
        const notes = await readNotes();

        const index = notes.findIndex(note => note.id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: 'Anotação não encontrada.' });
        }

        notes[index] = { title, id, description };
        await writeNotes(notes);
        res.status(200).json({ success: true, message: 'Anotação alterada com sucesso.', note: { title, id, description } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao processar a sua solicitação.' });
    }
}

async function listNotes(req, res) {
    try {
        const notes = await readNotes();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao processar a sua solicitação.' });
    }
}

async function deleteNote(req, res) {
    const noteId = req.params.id;
    try {
        const notes = await readNotes();
        const filteredNotes = notes.filter(note => note.id !== noteId);
        await writeNotes(filteredNotes);
        res.status(200).json({ success: true, message: 'Anotação excluída com sucesso.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao excluir a anotação.' });
    }
}

module.exports = {
    addNote,
    editNote,
    listNotes,
    deleteNote 
};
