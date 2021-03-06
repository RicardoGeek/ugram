var express = require('express');
var routes = require('./routes/'); 
var cors = require('cors');
var bodyParser = require('body-parser');
var middlewares = require('./middlewares/');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(middlewares.headersConfig);

app.use('/user', routes.userRoutes);
app.use('/photos', routes.photoRoute);
app.use('/album', routes.albumRoute)

app.listen(3000,  () => {
    console.log('Listening on port:  ' + 3000);
  });