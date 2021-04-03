var express = require('express');
var routes = require('./routes/');
var cors = require('cors');
var bodyParser = require('body-parser');
var middlewares = require('./middlewares/');
var userController = require('./controllers/user-controller');

var app = express();

app.use(cors());
app.use(bodyParser.json({
  limit: '20mb'
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '20mb'
}));
app.use(middlewares.headersConfig);

app.use('/user', routes.userRoutes);
app.use('/photos', routes.photoRoute);
app.use('/album', routes.albumRoute);
app.use('', routes.fileRoute);
app.use('/auth', userController.authUser);

app.listen(3000, () => {
  console.log('Listening on port:  ' + 3000);
});

app.get('/health', (req, res) => {
  res.send({
    "status": "up"
  })
})