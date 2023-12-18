const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.filter((user) => user.username === username).length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if there's a user with the given name and password
  const filteredUsers = users.filter((user) => (user.username === username && user.password === password));
  return filteredUsers.length == 1;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Get username and password
  const username = req.body.username;
  const password = req.body.password;

  // Check that a username was given
  if(!username) {
    // Send 400 Bad Request
    return res.status(400).send("No username given.");
  }

  // Check that a password was given
  if(!password) {
    // Send 400 Bad Request
    return res.status(400).send("No password given.");
  }

  // Authenticate the user
  if(authenticatedUser(req.body.username, req.body.password)) {
    // Generate token and store it in the session
    const token = jwt.sign(req.body, "user_fingerprint");
    req.session.user = token;
    return res.send("Customer successfully logged in");
  } else {
    // Send 400 Bad Request
    return res.status(400).send("Invalid credentials.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get review content
  const content = req.query.review;

  // Check if content was provided
  if(!content) {
    // Send 400 Bad Request
    return res.status(400).send("No review content provided.");
  }

  // Get the name of the current user
  const user = jwt.verify(req.session.user, "user_fingerprint");

  if(!user) {
    // Send 400 Bad Request
    return res.status(400).send("Invalid user token.");
  }

  // Add the review
  books[req.params.isbn].reviews[user.username] = content;
  return res.send(`The review for the book with ISBN ${req.params.isbn} has been added/updated.`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Get the ISBN of the review
    const isbn = req.params.isbn;

    // Get the name of the current user
    const user = jwt.verify(req.session.user, "user_fingerprint");

    if(!user) {
        // Send 400 Bad Request
        return res.status(400).send("Invalid user token.");
    }

    // Delete the review for the given book
    delete books[isbn].reviews[user.username];
    return res.send(`Reviews for the ISBN ${isbn} posted by the user ${user.username} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
