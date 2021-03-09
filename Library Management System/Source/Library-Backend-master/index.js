const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db.js');
var loginController = require('./controller/login-controller');
var bookController = require('./controller/books-controller');
var adminController = require('./controller/admin-controller');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));

app.listen(3000, () => console.log('Server started at port : 3000'));

app.use('/user', loginController);
app.use('/books', bookController);
app.use('/admin', adminController);
