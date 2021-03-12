const mongoose = require("mongoose");
const col_books = "books";
const userSchema = new mongoose.Schema({
  title: String,
  author: String,
  WrittenIn: Number,
  price: Number,
  pages: Number,
  Language: String,
  origin: String,
  isActive: Boolean,
  category: String,
  genre: String,
  awardWinner: Boolean,
  award: String,
  image: String,
  likes: Array,
  rating: Number,
  discription: String,
});

mongoose.model(col_books, userSchema);
module.exports = mongoose.model(col_books);
