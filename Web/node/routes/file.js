var express = require('express');
var fileController = require('../controllers/file-controller')
var multer = require('multer');

var app = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../node/tmp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
const upload = multer({
    storage: storage
});


app.post('/upload', upload.single('file'), fileController.uploadFileTemp)
app.post('/save', fileController.saveImage)




module.exports = app;