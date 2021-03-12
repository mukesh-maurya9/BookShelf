const express = require("express");
const mongoos = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../model/UserSchema");
const config = require("../config/Token");
const db = require("../config/Db");
const session = require("express-session")

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// all Users
router.get("/users", (req, res) => {
  User.find({}, (err, allUser) => {
    if (err) throw err;
    return res.status(200).send(allUser);
  });
});

// Sign Up Route
router.post("/signup", (req, res) => {
  User.findOne({ email: req.body.email }, (err, sameEmail) => {
    if (sameEmail)
      return res.redirect(
        "/auth/login?errMessage=Email already exist. Please Login."
      );
    if (sameEmail.phone == req.body.phone)
    return res.redirect(
      "/auth/login?errMessage=Phone No. already Taken, User another One."
    );
    else {
      let hashPassword = bcrypt.hashSync(req.body.password, 8);
      User.create(
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
          password: hashPassword,
          role: req.body.role ? req.body.role : "user",
          isActive: true,
        },
        (err, userData) => {
          if (err) throw err;
          res.redirect("/auth/login?successMessage=Successfully Register.");
        }
      );
    }
  });
});

// Sign Up Display
router.get("/signup", (req, res) => {
  let errMessage = req.query.errMessage ? req.query.errMessage : "";
  res.render("register", { errMessage: errMessage });
});
// Login Route
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, userData) => {
    if (err)
      return res
        .status(500)
        .redirect("/auth/login?errMessage=Invalid login. Try again.");
    if (!userData)
      return res
        .status(500)
        .redirect(
          "/auth/signup?errMessage=Account not Found. Please Signup first."
        );
    else {
      var validPassword = bcrypt.compareSync(
        req.body.password,
        userData.password
      );
      if (!validPassword)
        return res.redirect(
          "/auth/login?errMessage=Invalid password!! Try again."
        );
      var token = jwt.sign({ id: userData._id }, config.secret, {
        expiresIn: 43200,
      });
      req.session.userData = userData;
      req.session.token = token
      if (userData.role == "admin") {
        res.render("dashboard", {userData:req.session.userData, token:req.session.token});
      } else {
        res.redirect("/auth/profile");
      }
    }
  });
});
// login display
router.get("/login", (req, res) => {
  let errMessage = req.query.errMessage ? req.query.errMessage : "";
  let successMessage = req.query.successMessage ? req.query.successMessage : "";
  res.render("login", {
    errMessage: errMessage,
    successMessage: successMessage,
  });
});

// Profile route
router.get("/profile", (req, res) => {
  var tokenStr = req.headers["x-access-token"];
  if (!req.session.token)
    return res.status(500).send("Token Not found! Please login again.");
  else {
    jwt.verify(req.session.token, config.secret, (err, result) => {
      if (err)
        return res.status(500).send({ auth: false, Error: "Invalid token." });
      User.findById(result.id, { password: 0 }, (err, data) => {
        if (err) throw err;
        return res.render("Profile", { userInfo: data });
      });
    });
  }
});

// Update
router.put("/profile/update", (req, res) => {
  let id = ObjectId(req.body._id);
  User.updateOne(
    { id: id },
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role ? req.body.role : "user",
        isActive: req.body.isActive ? req.body.isActive : "",
      },
    },
    (err, updatedData) => {
      if (err)
        return res
          .status(500)
          .send({ Error: "Error update. Please try again." });
      res.status(200).send(`Update success. \n ${updatedData}`);
    }
  );
});
// logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  return res.redirect("/home?errMessage=You Have Sucessfully logout.")
});
module.exports = router;
