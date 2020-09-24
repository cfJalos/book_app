'use strict';

// dependencies

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const { response } = require('express');
require('ejs');
const methodOverRide = require('method-override')

const app = express();

//middlewares

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverRide('_method'));


//global variables
const PORT = process.env.PORT;

//Routes
app.get('/test', (req, res) => res.send('hello testing World'));
app.get('/', homePage);
app.get('/books/:id', getOneBook);
app.get('/searches/new', renderSearch);
app.post('/search', formInfoCatch);
app.post('/books', newBooks);
app.use('*', noPageHandler);

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {
  console.log(error);
});

app.use((err, req, res, next) => {
  res.status(500).render('./pages/error.ejs',{error: err, error_Msg: err.message});
});


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
      res.status(200).render('pages/search/show', {books: finalBooks})
    })
}

function renderSearch (req,res){
  res.render('pages/search/new')
}

function homePage (req,res) {
  const SQL = 'SELECT * FROM books;';
  client.query(SQL)
    .then(results => {
      let countBooks = results.rowCount;
      const allbooks = results.rows;
      res.render('pages/index.ejs', {
        bookList : allbooks,
        numOfBooks : countBooks
      });
    })
}

function newBooks (req, res) {
const {author, title, isbn, image_url, description} = req.body;

const SQL = `INSERT INTO books (author, title, image_url, isbn, description) VALUES ($1,$2,$3,$4,$5) RETURNING id;`;
const safeValues = [author, title, image_url, isbn, description ]
client.query(SQL, safeValues)
.then(result => {
res.redirect(`/books/${result.rows[0].id}`);
})
}

function getOneBook(req, res){
  const id = req.params.id;
  
  const sql = 'SELECT * FROM books WHERE id=$1;';
  const safeValues = [id];
  client.query(sql, safeValues)
    .then(results => {
      // results.rows will look like this: [{my bo}]
      const book = results.rows[0];
      res.render('pages/books/detail.ejs', {books: [book]})
    })
    .catch(error => {
      response.status(404).send('./pages/error.ejs',{error: err, error_Mes: err.message});
    })
}

function noPageHandler(request, response) {
// need a redriect to /error
  response.status(404).send('./pages/error.ejs',{error: err, error_Mes: err.message});
}

function Book (book) {
  this.image = book.imageLinks.thumbnail ? book.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://'): `https://i.imgur.com/J5LVHEL.jpg`;

  this.title = book.title ? book.title : 'the Book title seems to be missing';
  this.author = book.authors ? book.authors : 'The Book Author Info is Missing';
  this.description = book.description ? book.description : 'The book descriptions seems to be missing from the Database we applogise for the inconvience';
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  });
