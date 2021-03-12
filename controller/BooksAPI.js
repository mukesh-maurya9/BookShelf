const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const db = require("../config/Db");
const bodyParser = require("body-parser");
const Books = require("../model/BookSchema");
const path = require("path");
const hbs = require("hbs");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Search All Books
router.get("/allbooks", (req, res) => {
  Books.find({}, (err, allBooks) => {
    if (err) throw err;
    return res.render("BooksUpdate", {
      allBooks: allBooks,
      userData: req.session.userData,
    });
  });
});
// all books at home
router.get("/libBooks", (req, res) => {
  Books.find({}, (err, allBooks) => {
    if (err) throw err;
    return res.render("Books", { data: allBooks });
  });
});

// Search Latest
router.get("/latest", (req, res) => {
  Books.find({ latest: true }, (err, data) => {
    if (err) throw err;
    return res.status(200).render("latestBooks", { data: data });
  });
});
// Search BestSeller
router.get("/bestsellers", (req, res) => {
  Books.find({ price: { $lt: 2000, $gt: 500 } }, (err, data) => {
    if (err) throw err;
    return res.status(200).render("BestSellers", { data: data });
  });
});
// localhost:5000/books/authors
router.post("/author", (req, res) => {
  Books.find({ author: req.body.author }, (err, author) => {
    res.send(author);
  });
});
// localhost:5000/books/awardWinners
router.get("/awardWinners", (req, res) => {
  Books.find({ awardWinners: true }, (err, data) => {
    // console.log(awardWinners)
    return res.render("latestBooks", { data: data });
  });
});
// http://localhost:5000/books/description
router.get("/description/:id", (req, res) => {
  let id = req.params.id;
  Books.findOne({ _id: new mongoose.Types.ObjectId(id) }, (err, bookFields) => {
    if (err) throw err;
    return res.render("Description", { bookFields: bookFields });
  });
});

// http://localhost:5000/books/search
router.get("/search?title=", (req, res) => {
  Books.find({}, (err, result) => {
    if (err) throw err;
    res.render("Search", { result: result });
  });
});

// search bar
router.get("/searchBooks/:title", (req, res) => {
  let query = req.query.params ? req.query.params : "The Holy Bible";
  Books.find({ title: query }, (err, data) => {
    return res.status(200).send(data);
  });
});
// Search by Query
router.get("/category/:id", (req, res) => {
  let query = req.body.param;
  if (query) {
    books = Books.find({ category: query }, (err, data) => {
      if (err) {
        return res.send("Books Not Found");
      }
      res.status(200).send(data);
    });
  }
  res.redirect("/recommanded");
});

// search bar
router.get("/search", (req, res) => {
  let searchField = req.query.title;
  Books.find({ title: searchField }, (err, data) => {
    console.log(data);
    if (err) throw err;
    res.render("Search", { data: data[0] });
  });
});
// autocomplte
router.get("/autocomplete/", (req, res) => {
  var regex = new RegExp(req.query["term"], "i");
  var bookFilter = Books.find({ title: regex }, { title: 1 })
    .sort({ updated_at: -1 })
    .sort({ created_at: -1 })
    .limit(10);
  bookFilter.exec(function (err, data) {
    var result = [];
    if (!err) {
      if (data && data.length && data.length > 0) {
        data.forEach((book) => {
          let obj = {
            id: book._id,
            label: book.title,
          };

          result.push(obj);
        });
      }
    }
    res.jsonp(result);
  });
});

router.get("/author", (req, res) => {
  Books.find({ author: req.query.name }, (err, data) => {
    if (err) throw err;
    res.render("latestBooks", { data });
  });
});

module.exports = router;
