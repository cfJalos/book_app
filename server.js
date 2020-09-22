'use strict';

// dependencies

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
require('ejs');

const app = express();

//middlewares

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));

//global variables
const PORT = 3000;

//Routes
app.get('/hello', (req, res) => res.send("hello World"));
app.get('/', homePage);
app.get('/searches', renderSearch);
app.post('/searchform', formInfoCatch);
app.use('*', errorHandler);

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})

function formInfoCatch (req,res){
  const searchContent = req.body.search[0];
  const searchType = req.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  if (searchType === 'title'){url += `+intitle:${searchContent}`}
  if (searchType === 'author'){url += `+inauthor:${searchContent}`}
  superagent.get(url)
    .then(data => {
      const bookArr = data.body.items;
      const finalBooks = bookArr.map(book => new Book(book.volumeInfo));
      res.render('pages/search/show', {books: finalBooks})
  })
}

function renderSearch (req,res){
  res.render('pages/search/new')
}



function homePage (req,res) {
  res.render('pages/index');
}

function errorHandler(request, response) {
  response.status(404).send('STATUS:500 Error, wrong path');
}

function Book (book) {
  console.log(book);
  this.image = book.imageLinks.thumbnail ? book.imageLinks.thumbnail : 'public/img/J5LVHEL.jpg';
  this.title = book.title ? book.title : 'Book title';
  this.author = book.authors ? book.authors : 'Book Author';
  this.description = book.description ? book.description : 'qweqweqwe';
}
