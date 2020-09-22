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
const PORT = process.env.PORT;

//Routes
app.get('/hello', (req, res) => res.send("hello World"));
app.get('/', homePage);
app.get('/searches', renderSearch);
app.post('/searchform', formInfoCatch);
app.use('*', noPageHandler);
app.use((err, req, res, next) => {
  res.status(500).send(`Welcome to the DarkSide we have Cupcakes and a Server Error: ${err.message} : ${err.txt}`);

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

function noPageHandler(request, response) {
  response.status(404).send('This is not the Place you are Looking for Try again: Route Not found');
}

function Book (book) {
  console.log(book);
  this.image = book.imageLinks.thumbnail ? book.imageLinks.thumbnail : 'public/img/J5LVHEL.jpg';
  this.title = book.title ? book.title : 'the Book title seems to be missing';
  this.author = book.authors ? book.authors : 'The Book Author Info is Missing';
  this.description = book.description ? book.description : 'The book descriptions seems to be missing from the Database we applogise for the inconvience';
}
