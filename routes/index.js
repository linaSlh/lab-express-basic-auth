const express = require("express")
const router = express.Router();


router.get("/", (req, res, next) => {
  console.log("req.session", req.session)
  res.render("index");
});

module.exports = router;
