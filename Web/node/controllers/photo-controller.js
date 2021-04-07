var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');
var fileController = require('./file-controller')

const dynamo = new AWS.DynamoDB.DocumentClient(aws_keys.dynamodb);
const rekognition = new AWS.Rekognition(aws_keys.rekognition);
const s3Bucket = 'bucket-imagenes-practica1';


exports.detectText = async (req, res) => {
    let image = req.body.foto;

    let params = {
        Image: {
            S3Object: {
                Bucket: s3Bucket,
                Name: image
            }
        },

    }

    rekognition.detectText(params, (err, data) => {
        if (err) {
            res.status(500).send({
                'status': 'error',
                'message': err
            })
        } else {
            res.status(200).send({
                'status': 'success',
                'message': data.TextDetections
            })
        }

    })
}
exports.tagPhoto = async (req, res) => {
    let body = req.body
    const s3Photo = body.photo

    const rekognitionParams = {
        Image: {
            S3Object: {
                Bucket: s3Bucket,
                Name: s3Photo
            }
        },
        MaxLabels: 10
    }

    rekognition.detectLabels(rekognitionParams, (rekognitionError, response) => {
        if (rekognitionError) {
            res.status(500).send({
                'status': 'error',
                'message': rekognitionError
            })
        }

        const labels = response.Labels
        const tags = []
        for (labelIdx in labels) {
            const label = labels[labelIdx]
            if (label.Confidence > 80) {
                tags.push(label.Name)
            }
        }

        let params = {
            TableName: 'photos',
            Key: {
                'id_photo': s3Photo
            },
            UpdateExpression: 'set tags = :tags',
            ConditionExpression: 'attribute_exists(id_photo)',
            ExpressionAttributeValues: {
                ':tags': tags.toString(),
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
        })
    })
}

exports.createPhoto = async (req, res) => {
    let body = req.body;

    dynamo.put({
        TableName: 'photos',
        Item: {
            'id_album': body.id_album,
            'caption': body.caption,
            'id_photo': body.id_photo,
            'id_user': body.id_user,
            'url': body.url,
            'name': body.name
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
        UpdateExpression: 'set name=:n, #url=:u, caption=:c',
        ConditionExpression: 'attribute_exists(id_photo)',
        ExpressionAttributeValues: {
            ':n': body.name,
            ':u': body.url,
            ':c': body.caption,

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
            fileController.deletePhotoS3(photo)
                .then(data => {
                    res.status(200).send(data)
                })
                .catch(error => {
                    res.status(500).send(error)
                });

        }
    });
}

exports.deletePhotosByAlbum = async (id_user, id_album) => {
    params = {
        TableName: "photos",
        FilterExpression: "id_user = :ip and id_album = :ia",
        ExpressionAttributeValues: {
            ":ip": id_user,
            ":ia": id_album
        }

    }

    dynamo.scan(params, (err, dataPhotos) => {
        if (err) {
            console.log("data")
        } else {
            dataPhotos.Items.forEach(photo => {
                fileController.deletePhotoS3(photo.url)
                    .then(data => {
                        paramsDelete = {
                            TableName: 'photos',
                            Key: {
                                "id_photo": photo.id_photo
                            },
                            ConditionExpression: "id_album = :ip",
                            ExpressionAttributeValues: {
                                ":ip": id_album
                            }
                        };

                        dynamo.delete(paramsDelete, (err, data) => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    });
            });

        }
    });
}