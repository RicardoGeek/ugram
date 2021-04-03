var express = require('express');
var userController = require('../controllers/user-controller')

var app = express.Router();

app.post('', userController.createUser)
app.get('/:user_name', userController.getUser)
app.post('/:user_name/update', userController.updateUser)
app.post('/photo-auth', userController.photoLogin)

module.exports = app;