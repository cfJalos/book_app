# Book_app

**Author**: Czarl Jalos && Matt Ravenmoore
**Version**: 1.0.3
 (increment the patch/fix version number if you make more commits past your first submission)

## Overview

This is a book keeping app that pulls book data from google books and will store a personal library for the user to have thier books.

## Getting Started

1. install dependacnys:
you can do this individualy or as one command witn (npm i)

  * Express
  * dotenv
  * superAgent
  * EJS
  * postgres

1. Clone down the Repo from gitHub located at :

1. create a postgress database named and link the books.sql file

## Architecture

Currently using:

* node.js
  * express
  * cors
  * ejs
* JavaScript
* heroku
* superAgent
* postgres

## Change Log

09-21-2020 2:15pm PST - Application now has a fully-functional basic express server, with heroku deployment and proof of life route.

09-21-2020 3:05pm PST - App is now has a search bar for searching books by title and authors.

09-21-2020 4:02pm PST - App now communicates with google books and displays data in a useable way.

09-22-2020 4:02pm PST - App has a database hooked up and can display from that database (can not store yet)

09-23-2020 11:15pm PST - App can now edit stored books and store books from the api img still broken and it seems to be nesting my edited books for some reason.

## work log

[Worklog](worklog.md)
[Style Guide](styleguide.md)

## Credits and Collaborations

SERVER FIX FOR STUCK OPEN:
sudo killall -9 node credit ta Kait.