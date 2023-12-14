const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send all books
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Send the book that matches the given ISBN
  return res.json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Filter by author and send the results
  let filteredBooks = Object.keys(books)
  .map((key) => books[key])
  .filter((book) => book.author === req.params.author);
  return res.json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Filter by title and send the results
  let filteredBooks = Object.keys(books)
  .map((key) => books[key])
  .filter((book) => book.title === req.params.title);
  return res.json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
