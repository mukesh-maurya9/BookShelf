const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const db = require("../config/Db");
const bodyParser = require("body-parser");
const Books = require("../model/BookSchema");
const User = require("../model/UserSchema");
const Order = require("../model/OrderSchema");
const path = require("path");
const hbs = require("hbs");

router.post("/order/:id", (req, res)=>{
    if (!req.session.token){
        res.redirect("/auth/login?errmessage=No session found Please login frist.")
    }
    let id = req.params.id;
    console.log(id)
    console.log(req.session.userData)
    Books.findOne({_id:new mongoose.Types.ObjectId(id)}, (err, data)=>{
        if (err) throw err;
        Order.create({orderId:id, book:data}, (err, data)=>{
            return res.redirect("/books/description/id?successMessage=your order has successfully Placed.")
        })
    })
})
router.get("/order/:id", (req, res)=>{
    id = req.params.id
    return res.redirect("/books/description/id?successMessage=your order has successfully Placed.")
})
module.exports = router;