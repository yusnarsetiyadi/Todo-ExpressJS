const db = require('../database/mysql')

function getAllTask(req, res) {
    const query = 'SELECT * FROM task';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
}

function createTask(req, res) {
    const todo = {
        title: req.body.title,
        completed: false,
    };
    const query = 'INSERT INTO task (title, completed) VALUES (?, ?)';
    db.query(query,[todo.title,todo.completed], (err, results) => {
        if (err) throw err;
        todo.id = results.insertId;
        res.status(201).json(todo);
    });
}

function updateTask(req, res) {
    const id = parseInt(req.params.id);
    const todo = {
        completed: req.body.completed,
    };
    const query = 'UPDATE task SET completed = ? WHERE id = ?';
    db.query(query,[todo.completed,id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        todo.id = id;
        res.json(todo);
    });
}

function deleteTask(req, res) {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM task WHERE id = ?';
    db.query(query,[id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.status(204).send();
    });
}

module.exports = {
  getAllTask,
  createTask,
  updateTask,
  deleteTask,
}