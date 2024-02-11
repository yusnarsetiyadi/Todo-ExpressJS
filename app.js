const express = require("express");
const serveStatic = require("serve-static");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mysql = require("mysql2");

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(serveStatic("public"));

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// GET endpoint to fetch all todo items from the database
app.get("/tasks", (req, res) => {
  const query = 'SELECT * FROM task';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST endpoint to create a new todo item
app.post("/tasks", (req, res) => {
  const todo = {
    title: req.body.title,
    completed: false,
  };
  const query = 'INSERT INTO task (title, completed) VALUES (?, ?)';
  db.query(query, [todo.title, todo.completed], (err, result) => {
    if (err) throw err;
    todo.id = result.insertId;
    res.status(201).json(todo);
  });
});

// PUT endpoint to update an existing todo item with the specified `id`
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = {
    completed: req.body.completed,
  };
  const query = 'UPDATE task SET completed = ? WHERE id = ?';
  db.query(query, [todo.completed, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todo.id = id;
    res.json(todo);
  });
});

// DELETE endpoint to remove an existing todo item with the specified `id`
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const query = 'DELETE FROM task WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(204).send();
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
