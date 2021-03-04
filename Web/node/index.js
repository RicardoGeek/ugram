var express = require('express');
var routes = require('./routes/'); 
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', routes.userRoutes);

app.listen(3000,  () => {
    console.log('Listening on port:  ' + 3000);
  });