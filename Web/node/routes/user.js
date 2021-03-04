var express = require('express');
var AWS = require('aws-sdk');
const { S3 } = require('aws-sdk');
var aws_keys = require('../config/creeds.js');
var uuid = require('node-uuid');

const s3 = new AWS.S3(aws_keys.s3);
const dynamo = new AWS.DynamoDB(aws_keys.dynamodb);

var app = express.Router();

app.post('/create', (req, res) => {
    let body = req.body;

    

    let filePath = `${body.user_name}/default/${body.photo}`;

    let uploadUserPhoto = {
        Bucket: 'bucket-imagenes-practica1',
        Key: filePath,
        Body: Buffer.from(body.base64, 'base64'),
        ACL: 'public-read',
    } 

    let id = uuid();
    s3.upload(uploadUserPhoto, (err, data) =>{
        if (err) {
            res.send('Error: ', err);
        } else {
            dynamo.putItem({
                TableName: 'users',
                Item: {
                    'user_name': {S: body.user_name},
                    'fullname': {S: body.fullname},
                    'password': {S: body.password}
                }
            }, (err,data) =>{
                if (err) {
                    res.send('Error guardando usuario: ', err);
                } else {
                    dynamo.putItem({
                        TableName: 'albumes',
                        Item: {
                            'id_album': { S: id },
                            'user_name': {S: body.user_name},

                        }
                    }, (err, data) =>{
                        if (err) {
                            res.send('Error guardando album: ', err);
                        } else {
                            dynamo.putItem({
                                TableName: 'fotos',
                                Item: {
                                    'url': {S: filePath},
                                    'id_album': { S: id }
                                }
                            }, (err,dat)=>{
                                if (err) {
                                    res.send('Error guardando foto: ', err);
                                } else {
                                    res.send('Registro Guardado con Exito');
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});



module.exports = app;