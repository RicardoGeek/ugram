var express = require('express');
var translateController = require('../controllers/translate-controller')

var app = express.Router();

app.post('', translateController.doTranslation)

module.exports = app