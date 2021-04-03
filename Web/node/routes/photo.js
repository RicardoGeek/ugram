var express = require('express');
var photoController = require('../controllers/photo-controller')

var app = express.Router();

app.post('', photoController.createPhoto)
app.post('/:id_photo/update', photoController.updatePhoto)
app.get('/:id_user', photoController.getUserPhotos)
app.get('/:id_user/:id_album', photoController.getUserPhotosByAlbum)
app.delete('/:id_photo', photoController.deletePhoto)
app.post('/tag', photoController.tagPhoto)

module.exports = app;