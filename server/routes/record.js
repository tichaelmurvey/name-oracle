const express = require("express");
const router = express.Router();
const getnames = require("../modules/getnames.js")
const queries = require("../modules/queries.js")

async function renderUnique(res){
  const unique_roles = await queries.getUnique("role")
  const unique_settings = await queries.getUnique("setting")
  res.render("pages/unique", {data: unique_roles})
}

async function renderHome(res){
  const unique_roles = await queries.getUnique("role")
  const unique_settings = await queries.getUnique("setting")
  res.render("pages/index", {roles: unique_roles, settings: unique_settings, selected: []});
}

async function renderResults(req, res){
  const unique_roles = await queries.getUnique("role")
  const unique_settings = await queries.getUnique("setting")
  let role = req.query.role;
  let setting = req.query.setting;
  let quant = req.query.quant;
  console.log("Requested " + role + " from setting " + setting);
  const names = await getnames.getNames(role, setting, quant);
  res.render("pages/index", {roles: unique_roles, settings: unique_settings, results: names, selected: [req.query.role, req.query.setting]});

}

router.get("/", (req, res) => {
  if(req.query.role && req.query.setting){
    renderResults(req, res);
  } else {
    renderHome(res)
  }
});

router.get("/unique", (req, res) => {
  renderUnique(res)
})

router.get("/about", (req, res) => {
  res.render("pages/about");
});

router.get("/contact", (req, res) => {
  res.render("pages/contact");
});

module.exports = router;
