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
  res.render("pages/index", {roles: unique_roles, settings: unique_settings});
}

router.get("/", (req, res) => {
  renderHome(res)
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

router.get("/names", (req, res) => {
  let role = req.query.role;
  let setting = req.query.setting;
  console.log("Requested " + role + " from setting " + setting);
  res.render("pages/index", {data: null});
});

module.exports = router;
