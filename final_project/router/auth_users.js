const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}


const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    } 
});
const reviewDoesExist = (book,username)=>{
    let userswithsamename = Object.keys(book.reviews).filter((user)=>{
      return user === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    // return res.status(200).json({message:JSON.stringify(reviewDoesExist(book,req.session.authorization.username))});
 
        if (!reviewDoesExist(book,req.session.authorization.username)) { 
            Object.assign(books[req.params.isbn].reviews,{[req.session.authorization.username]:"new review"});
          return res.status(200).json({message: "review successfully added"});
        } else {
            books[req.params.isbn].reviews[req.session.authorization.username]="new review";
            return res.status(200).json({message: "review updated successfully "});
        }
      
      return res.status(404).json({message: "Unable to add review."});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
 
        if (!reviewDoesExist(book,req.session.authorization.username)) { 
          return res.status(404).json({message: "No review Exists"});
        } else {
            delete books[req.params.isbn].reviews[req.session.authorization.username];
            return res.status(200).json({message: "review deleted successfully "});
        }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
