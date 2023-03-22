const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return users.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
 
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let promise = new Promise(function (resolve, reject) {
      resolve(books);
      reject('no books avaliable');
  });
  promise.then((result)=> {
    return  res.status(200).json({message:JSON.stringify(result)})

  },(error)=> {
    return  res.status(404).json({message:JSON.stringify(error)})

  });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
let promise = new Promise((resolve,reject)=>{
    resolve(books[req.params.isbn]);
    reject('book does not exists')
})
  
  promise.then((result)=> {
    return  res.status(200).json({message:JSON.stringify(result)})

  },(error)=> {
    return  res.status(404).json({message:JSON.stringify(error)})

  });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    let promise = new Promise((resolve,reject)=>{
        keys = Object.keys(books);
        for(let i=1;i<=keys.length;i++) {
          if(req.params.author == books[i].author) {
              resolve(books[i]);
          }
        }

        reject("Author Not Found");
    }).then((result)=> {
        return  res.status(200).json({message:JSON.stringify(result)})
    
      },(error)=> {
        return  res.status(404).json({message:JSON.stringify(error)})
    
      });
    

  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let promise = new Promise((resolve,reject)=> {
        keys = Object.keys(books);
        console.log(books);
      for(let i=1;i<=keys.length;i++) {
        if(req.params.title == books[i].title) {
            resolve(books[i]);
        }
      }
      reject("Title Not Found");
    }).then((result)=>{
        return res.status(200).json({message: JSON.stringify(result)});
    },(error)=>{
        return res.status(404).json({message: error});

    });
    
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(200).json({message:JSON.stringify(books[req.params.isbn].reviews)})

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
