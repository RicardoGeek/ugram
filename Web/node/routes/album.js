var express = require('express');
var albumController = require('../controllers/album-controller')

var app = express.Router();

app.post('', albumController.createAlbum);
app.get('/:user_name', albumController.getUserAlbum);
app.post('/:user_id/:id_album/update', albumController.updateAlbum);
app.delete('/:user_id/:id_album/delete', albumController.deleteAlbum);

module.exports = app;