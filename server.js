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
      res.render('pages/show', {books: finalBooks})
  })
}

function renderSearch (req,res){
  res.render('pages/search/new')
}



function homePage (req,res) {
  res.render('pages/index');
}