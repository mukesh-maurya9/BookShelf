const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Books = require("../model/BookSchema");
const User = require("../model/UserSchema");
const Order = require("../model/OrderSchema");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// http://localhost:5000/admin/about
router.get("/about", (req, res) => {
  res.render("About");
});

// http://localhost:5000/admin/dashboard   #admin dashboard
router.get("/dashboard", (req, res) => {
  if (!req.session.token) {
    return res.redirect(
      "/auth/login?errMessage=No session found. Login again."
    );
  }
  if (req.session.userData.role !== "admin") {
    return res.redirect(
      "/auth/login?errMessage=Permission denied, you are not Admin"
    );
  }
  Order.countDocuments({ isActive: true }, (err, count) => {
    return res.render("dashboard", {
      count: +count,
      userData: req.session.userData,
    });
  });
});
// http://localhost:5000/admin/allUsers
router.get("/allUsers", (req, res) => {
  let errMessage = req.query.errMessage ? req.query.errMessage : "";
  if (!req.session.token) {
    return res.redirect(
      "/auth/login?errMessage=No session found. Login again."
    );
  }
  if (req.session.userData.role !== "admin") {
    return res.redirect(
      "/auth/login?errMessage=Permission denied, you are not Admin"
    );
  }
  User.find({}, (err, data) => {
    if (err) throw err;
    return res.render("Users", {
      userRecord: data,
      userData: req.session.userData,
    });
  });
});
// Edit Users
// http://localhost:5000/admin/allUsers/edit
router.put("/allUsers/edit/:id", (req, res) => {
  let id = User.ObjectId(req.params.id);
  console.log("id ==>>", id);
  User.find({ _id: id }, (err, data) => {
    console.log("data==>>", data);
    return res.send(data);
  });
});
router.get("/books", (req, res) => {
  Books.find({}, (err, data) => {
    res.send(data);
  });
});
// http://hocalhost:5000/admin/allorders        # for all orders
router.get("/allorders", (req, res) => {
  if (!req.session.token) {
    return res.redirect(
      "/auth/login?errMessage=No session found. Login again."
    );
  }
  if (req.session.userData.role !== "admin") {
    return res.redirect(
      "/auth/login?errMessage=Permission denied, you are not Admin"
    );
  }
  Order.countDocuments({ isActive: true }, (err, count) => {
    return res.status(200).send("Total order   is " + count);
  });
});

// http://localhost:5000/admin/remove
router.delete("/remove", (req, res)=>{
  let email = req.body.value;
  console.log("Email=>",email)
})
module.exports = router;
