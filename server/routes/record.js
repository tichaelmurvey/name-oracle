const express = require("express");
const router = express.Router();
const getnames = require("../modules/getnames.js")
const dbo = require("../db/conn");

queryDb = async function (req, res) {
  const searchTerm = req.params.amenity;
  const dbConnection = dbo.getDb();

  const data = await dbConnection
    .collection("listingsAndReviews")
    .find({ amenities: searchTerm })
    .toArray();

  res.render("pages/index", { data });
};

router.get("/search-amenities/:amenity", queryDb);

router.get("/", (req, res) => {
  res.render("pages/index", { data: null });
});

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
