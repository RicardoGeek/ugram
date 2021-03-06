var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');


const dynamo = new AWS.DynamoDB.DocumentClient(aws_keys.dynamodb);

exports.createPhoto = async (req, res) => {
    let body = req.body;

    dynamo.put({
        TableName: 'photos',
        Item: {
            'id_album': body.id_album,
            'caption': body.caption,
            'id_photo': body.id_photo,
            'id_user': body.id_user,
            'url': body.url
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
            'id_photo': req.params.id_photo
        },
        UpdateExpression: 'set caption=:c, #url=:u',
        ConditionExpression: 'attribute_exists(id_photo)',
        ExpressionAttributeValues: {
            ':c': body.caption,
            ':u': body.url

        },
        ExpressionAttributeNames: {
            "#url": "url"
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

exports.getUserPhotos = async (req, res) => {
    let user = req.params.id_user

    params = {
        TableName: "photos",
        FilterExpression: "id_user = :ip",
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

exports.getUserPhotosByAlbum = async (req, res) => {
    let user = req.params.id_user;
    let album = req.params.id_album;

    params = {
        TableName: "photos",
        FilterExpression: "id_user = :ip and id_album = :ia",
        ExpressionAttributeValues: {
            ":ip": user,
            ":ia": album
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

exports.deletePhoto = async (req, res) => {
    let photo = req.params.id_photo;

    params = {
        TableName: 'photos',
        Key: {
            "id_photo": photo
        },
        ConditionExpression: "id_photo = :ip",
        ExpressionAttributeValues: {
            ":ip": photo
        }
    };

    dynamo.delete(params, (err, data) => {
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