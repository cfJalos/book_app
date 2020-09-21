'use strict';

// dependencies

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const { response } = require('express');
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


app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})

function homePage (req,res) {
  res.render('pages/index');
}