var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');


const dynamo = new AWS.DynamoDB(aws_keys.dynamodb);

exports.createPhoto = async (req, res) => {
    let body = req.body;

    dynamo.putItem({
        TableName: 'photos',
        Item: {
            'id_album': {
                S: body.id_album
            },
            'caption': {
                S: body.caption
            },
            'id_photo': {
                S: body.id_photo
            },
            'id_user': {
                S: body.id_user
            },
            'url': {
                S: body.url
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


exports.updatePhoto = async (req, res) => {
    let body = req.body;

    let params = {
        TableName: 'photos',
        Key: {
            'id_photo': {
                S: req.params.id_photo
            }
        },
        UpdateExpression: 'set caption=:c, #url=:u',
        ConditionExpression: 'attribute_exists(id_photo)',
        ExpressionAttributeValues: {
            ':c': {
                S: body.caption
            },
            ':u': {
                S: body.url
            }
            
        },
        ExpressionAttributeNames: {
            "#url": "url"
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

exports.getUserPhotos = async (req, res) => {
    let user = req.params.id_user

    params = {
        TableName: "photos",
        FilterExpression: "id_user = :ip",
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

exports.getUserPhotosByAlbum = async (req, res) => {
    let user = req.params.id_user;
    let album = req.params.id_album;

    params = {
        TableName: "photos",
        FilterExpression: "id_user = :ip and id_album = :ia",
        ExpressionAttributeValues: {
            ":ip": {
                S: user
            },
            ":ia": {
                S: album
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

exports.deletePhoto = async (req, res) => {
    let photo = req.params.id_photo;

    params = {
        TableName:'photos',
        Key:{
            "id_photo": {S: photo}
        },
        ConditionExpression:"id_photo = :ip",
        ExpressionAttributeValues: {
            ":ip": {S: photo}
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