var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');
var fs = require('fs');

const s3 = new AWS.S3(aws_keys.s3);

exports.uploadFileTemp = async (req, res) => {
    if (!req.file) {
        return res.status(500).send({
            'status': 'error',
            'message': 'No se pudo guardar el archivo'
        });

    } else {
        return res.status(200).send({
            'status': 'success',
            'file': req.file.filename
        })
    }
}

exports.saveImage = async (req, res) => {
    let body = req.body;
    let file = fs.readFileSync('../node/tmp/' + body.filename);
    let uploadUserPhoto = {
        Bucket: 'bucket-imagenes-practica1',
        Key: body.user_name + '/' + body.filename,
        Body: file,
        ACL: 'public-read',
    }

    s3.upload(uploadUserPhoto, (err, data) => {
        if (err) {
            res.status(500).send({
                'status': 'error',
                'message': 'Error al subir imagen en S3: ' + err
            })
        } else {
            fs.unlinkSync('../node/tmp/' + body.filename)
            res.status(200).send({
                'status': 'success',
                'result': body.user_name + '/' + body.filename
            })
        }
    });

}

exports.deletePhotoS3 = async (url) => {
    var params = {
        Bucket: 'bucket-imagenes-practica1',
        Key: url
    }

    return s3.deleteObject(params).promise();
}

exports.deletePhotosByalbum = async (id_album) =>{

    

}