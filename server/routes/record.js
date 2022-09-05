const express = require("express");

const router = express.Router();

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

module.exports = router;
