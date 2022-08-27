const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.

const router = express.Router();

// This will help us connect to the database
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

// router.use("/search-amenities/:amenity", (req, res, next) => {
//   const searchParam = req.params.amenity;
//   const dbCon = dbo.getDb("sample_airbnb");
//   dbCon
//     .collection("listingsAndReviews")
//     .find({ amenities: searchParam })
//     .toArray((err, result) => {
//       if (err) throw err;
//       console.log(res.json(result));
//     });
// });

// router.use("/", (req, res) => {
//   res.send("Welcome to my website");
// });

module.exports = router;
