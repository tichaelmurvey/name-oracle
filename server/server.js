const express = require("express");
const app = express();
const cors = require("cors");
const path = require('path');
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));


// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});
app.get('/hello_world', (req, res) => {
  res.send('Hello World!');
})

app.get('/', (req, res) => {
  res.render('pages/index',{test: "i am a strange test"});
})