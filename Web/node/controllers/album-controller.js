var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');
var photosController = require('./photo-controller')

const dynamo = new AWS.DynamoDB.DocumentClient(aws_keys.dynamodb);

exports.createAlbum = async (req, res) => {
    let body = req.body;

    let errors = await validate(body);

    if (errors.length > 0) {
        res.status(400).send({
            'status': 'error',
            'errors': errors
        })
    } else {
        dynamo.put({
            TableName: 'albumes',
            Item: {
                'id_album': body.id_album,
                'album_name': body.album_name,
                'user_name': body.user_name
            }
        }, (err, data) => {
            if (err) {
                res.status(500).send({
                    'status': 'error',
                    'message': err
                })
            } else {
                res.status(200).send({
                    'status': 'success',
                    'message': data
                })
            }
        });
    }


}

let validate = async (body) => {
    listErrors = [];



    if (!body.id_album) {
        listErrors.push('El id del album no puede estar vacio');
    }

    if (!body.album_name) {
        listErrors.push('El nombre del album no puede estar vacio');
    }

    if (!body.user_name) {
        listErrors.push('El nombre de usuario no puede estar vacio');
    }




    return listErrors;
}

exports.getUserAlbum = async (req, res) => {
    let user = req.params.user_name

    params = {
        TableName: "albumes",
        FilterExpression: "user_name = :ip",
        ExpressionAttributeValues: {
            ":ip": user
        }

    }

    dynamo.scan(params, (err, data) => {
        if (err) {
            res.status(500).send({
                'status': 'error',
                'message': err
            })
        } else {
            res.status(200).send({
                'status': 'success',
                'message': data
            })
        }
    });
}

exports.updateAlbum = async (req, res) => {
    let body = req.body;

    let params = {
        TableName: 'albumes',
        Key: {
            'id_album': req.params.id_album
        },
        UpdateExpression: 'set album_name=:an',
        ConditionExpression: 'attribute_exists(id_album)',
        ExpressionAttributeValues: {
            ':an': body.album_name

        },
        ReturnValues: "UPDATED_NEW"
    }

    dynamo.update(params, (err, data) => {
        if (err) {
            res.status(500).send({
                'status': 'error',
                'message': err
            })
        } else {
            res.status(200).send({
                'status': 'success',
                'message': data
            })
        }
    });
}

exports.deleteAlbum = async (req, res) => {
    let album = req.params.id_album;
    
    params = {
        TableName: 'albumes',
        Key: {
            "id_album": album
        },
        ConditionExpression: "id_album = :ia",
        ExpressionAttributeValues: {
            ":ia": album
        }
    };

    dynamo.delete(params, (err, data) => {
        if (err) {
            res.status(500).send({
                'status': 'error',
                'message': err
            })
        } else {
            photosController.deletePhotosByAlbum(req.params.user_id, album)
            res.status(200).send({
                'status': 'success',
                'message': data
            })
        }
    });
}