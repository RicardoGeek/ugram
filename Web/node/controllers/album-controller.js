var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');


const dynamo = new AWS.DynamoDB(aws_keys.dynamodb);

exports.createAlbum = async (req, res) => {
    let body = req.body;

    let errors = await validate(body);

    if (errors.length > 0) {
        res.status(400).send({
            'status': 'error',
            'errors': errors
        })
    } else {
        dynamo.putItem({
            TableName: 'albumes',
            Item: {
                'id_album': {
                    S: body.id_album
                },
                'album_name': {
                    S: body.album_name
                },
                'user_name': {
                    S: body.user_name
                }
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

validate = async (body) => {
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
            ":ip": {
                S: user
            }
        }
        
    }

    dynamo.scan(params, (err,data) => {
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
            'id_album': {
                S: req.params.id_album
            }
        },
        UpdateExpression: 'set album_name=:an',
        ConditionExpression: 'attribute_exists(id_album)',
        ExpressionAttributeValues: {
            ':an': {
                S: body.album_name
            }
            
        },
        ReturnValues: "UPDATED_NEW"
    }

    dynamo.updateItem(params, (err, data) => {
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
        TableName:'albumes',
        Key:{
            "id_album": {S: album}
        },
        ConditionExpression:"id_album = :ia",
        ExpressionAttributeValues: {
            ":ia": {S: album}
        }
    };

    dynamo.deleteItem(params, (err,data)=>{
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