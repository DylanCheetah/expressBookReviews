const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Get the username and password
  const username = req.body.username;
  const password = req.body.password;

  // Ensure that a username was supplied
  if(!username) {
    // Send 400 Bad Request
    return res.status(400).json({message: "Missing username."});
  }

  // Ensure that a password was supplied
  if(!password) {
    // Send 400 Bad Request
    return res.status(400).json({message: "Missing password."});
  }

  // Ensure that the username is valid
  if(!isValid(username)) {
    // Send 400 Bad Request
    return res.status(400).json({message: "Username not available."});
  }

  // Add the new user and send 200 OK
  users.push(req.body);
  return res.json({message: "Customer successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send all books
  return res.json({books});
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
  .filter((isbn) => books[isbn].author === req.params.author)
  .map((isbn) => ({isbn, title: books[isbn].title, reviews: books[isbn].reviews}));
  return res.json({booksbyauthor: filteredBooks});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  // Filter by title and send the results
  let filteredBooks = Object.keys(books)
  .filter((isbn) => books[isbn].title === req.params.title)
  .map((isbn) => ({isbn, author: books[isbn].author, reviews: books[isbn].reviews}));
  return res.json({booksbytitle: filteredBooks});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Send the reviews for the book identified by the given ISBN
  return res.json(books[req.params.isbn].reviews);
});

// Get books asynchronously
public_users.get("/Task10", (req, res) => {
  // Get the book list
  axios.get("http://localhost:5000/")
  .then((response) => {
    return res.json(response.data);
  })
  .catch((err) => {
    return res.json(err);
  });
});

// Get book details asynchronously
public_users.get("/Task11/isbn/:isbn", (req, res) => {
  // Get the book details
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
  .then((response) => {
    return res.json(response.data);
  })
  .catch((err) => {
    return res.json(err);
  });
});

// Get book by author asynchronously
public_users.get("/Task12/author/:author", (req, res) => {
  // Get book by author
  axios.get(`http://localhost:5000/author/${req.params.author}`)
  .then((response) => {
    return res.json(response.data);
  })
  .catch((err) => {
    return res.json(err);
  });
});

// Get book by title asynchronously
public_users.get("/Task13/title/:title", (req, res) => {
  // Get book by title
  axios.get(`http://localhost:5000/title/${req.params.title}`)
  .then((response) => {
    return res.json(response.data);
  })
  .catch((err) => {
    return res.json(err);
  });
});

module.exports.general = public_users;
