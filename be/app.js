const express = require("express");
const serveStatic = require("serve-static");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database/mysql");
const taskRouter = require('./route/task')
const PORT = process.env.PORT;
require("dotenv").config();

app.use(serveStatic("fe"));
app.use(bodyParser.json());
app.use('/task', taskRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
