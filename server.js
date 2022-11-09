//Dependencies
const mongoose = require('mongoose');
const query = require("./modules/queries");
const express = require("express");
const path = require("path");
require('dotenv').config();

//Local modules
const getnames = require("./modules/getnames.js")
const queries = require("./modules/queries.js")

//Create app
const app = express();

//App params
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));

//Connect DB
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to database'))

//Advanced render functions
async function renderHome(res){
  const unique_roles = await queries.getUnique("role")
  const unique_settings = await queries.getUnique("setting")
  res.render("pages/index", {roles: unique_roles, settings: unique_settings, selected_role: undefined, selected_setting: undefined});
}

async function renderResults(req, res){
  const unique_roles = await queries.getUnique("role")
  const unique_settings = await queries.getUnique("setting")
  let role = req.query.role;
  let setting = req.query.setting;
  let quant = req.query.quant;
  console.log("Requested " + role + " from setting " + setting);
  const names = await getnames.getNames(role, setting, quant);
  res.render("pages/index", {roles: unique_roles, settings: unique_settings, results: names, selected_role: req.query.role, selected_setting: req.query.setting});
}

function makeHomePage(res){
  res.send("function response");
}


app.get('/', async (req, res) => {
    console.log("running index")
    if(req.query.role && req.query.setting){
      renderResults(req, res);
    } else {
      await renderHome(res);
      // res.send("home without data");
      console.log("done");
      res.end();
    }
  });

app.get("/about", (req, res) => {
  res.render("pages/about");
});

app.get("/contact", (req, res) => {
  res.render("pages/contact");
});

app.get("/thankyou", (req, res) => {
    res.render("pages/thankyou");
});

app.get("/*", (req, res) => {
    console.log("running 404")
    res.render('pages/404');
})

app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));
