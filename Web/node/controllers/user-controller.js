const AWS = require('aws-sdk');
const aws_keys = require('../config/creeds.js');
const crypto = require('crypto');
const atob = require('atob')

const dynamo = new AWS.DynamoDB.DocumentClient(aws_keys.dynamodb);
const rekognition = new AWS.Rekognition(aws_keys.rekognition);
const s3 = new AWS.S3(aws_keys.s3);

exports.createUser = async (req, res) => {

    let body = req.body;

    let errors = await validate(body);

    if (errors.length > 0) {
        res.status(400).send({
            'status': 'error',
            'errors': errors
        })
    } else {

        dynamo.put({
            TableName: 'users',
            Item: {
                'user_name': body.user_name,
                'fullname': body.fullname,
                'password': crypto.createHash('md5').update(body.password).digest('hex')
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

let validateUpdate = async (body) => {
    listErrors = [];
    if (!body.fullname) {
        listErrors.push('El nombre completo es requerido');
    }

    if (!body.password) {
        listErrors.push('El password es requerido');
    }

    return listErrors;
}

let validate = async (body) => {
    listErrors = [];

    if (!body.user_name) {
        listErrors.push('El nombre de usuario es requerido');
    } else {
        if (body.user_name.includes(' ')) {
            listErrors.push('El nombre de usuario no debe contener espacios');
        }

        params = {
            Key: {
                "user_name": body.user_name
            },
            TableName: "users"
        }

        let find = await dynamo.get(params).promise().then(data => {
            if (data.Item) {
                listErrors.push('Ese nombre de usuario ya esta en uso');
            }
        }).catch(error => {
            listErrors.push('Error al verificar al usuario en la base de datos: ', error);
        })

    }

    if (!body.fullname) {
        listErrors.push('El nombre completo es requerido');
    }

    if (!body.password) {
        listErrors.push('El password es requerido');
    }

    return listErrors;
}

exports.getUser = async (req, res) => {
    params = {
        Key: {
            "user_name": req.params.user_name
        },
        TableName: "users"
    }
    dynamo.get(params).promise().then(data => {
        if (data.Item) {
            res.status(200).send(
                data.Item
            );
        } else {
            res.status(404).send({
                'status': 'error',
                'message': 'Usuario no encontrado'
            })
        }
    }).catch(error => {
        res.status(500).send({
            'status': 'error',
            'message': 'Error al buscar usuario en la base de datos'
        })
    })
}

exports.updateUser = async (req, res) => {
    let body = req.body;

    let errors = await validateUpdate(body);

    if (errors.length > 0) {
        res.status(400).send({
            'status': 'error',
            'errors': errors
        })
    } else {
        let params = {
            TableName: 'users',
            Key: {
                'user_name': req.params.user_name
            },
            UpdateExpression: 'set fullname=:fn, password=:p',
            ConditionExpression: 'attribute_exists(user_name)',
            ExpressionAttributeValues: {
                ':fn': body.fullname,
                ':p': crypto.createHash('md5').update(body.password).digest('hex')
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
}

exports.photoLogin = async (req, res) => {
    let user = req.body.username;
    let photoId = req.body.photoId; // base64 enconded

    const s3Bucket = 'bucket-imagenes-practica1';

    params = {
        TableName: "photos",
        ExpressionAttributeValues: {
            ':user': `${user}/`
        },
        FilterExpression: 'contains(id_photo, :user)'
    }
    
    // get the s3 profile photo
    dynamo.scan(params, (err, data) => {
        if(err) {
            res.status(500).send({
                'status': 'error',
                'message': err
            })
        } else {
            if(data.Items.length > 0) {
                let defaultPhotoAddress = data.Items[0].id_photo
                for(item in data.Items) {
                    if (data.Items[item].id_album === `${user}/Default`) {
                        defaultPhotoAddress = data.Items[item].id_photo
                    }
                }

                const bucketParams = {
                    Key: defaultPhotoAddress,
                    Bucket: s3Bucket
                }

                s3.getObject(bucketParams, (s3err, data) => {
                    if(s3err) {
                        res.status(500).send({
                            'status': 'error',
                            'message': err
                        })
                    }

                    const sourceImage = data.Body
                    const targetImage = new Buffer.from(photoId, 'base64')

                    const recognitionParams = {
                        SourceImage: {
                            Bytes: sourceImage
                        },
                        TargetImage: {
                            Bytes: targetImage
                        }
                    }

                    rekognition.compareFaces(recognitionParams, (rekerr, data) => {
                        if(rekerr) {
                            res.status(500).send({
                                'status': 'error',
                                'message': rekerr
                            })
                        }
                        const faceMatch = data.FaceMatches[0].Similarity
                        const confidence = data.FaceMatches[0].Face.Confidence
                        res.status(200).send({
                            'status': 'success',
                            'result': {
                                'match': faceMatch,
                                'confidence': confidence
                            }
                        })
                    })
                })
            } else {
                res.status(404).send({
                    'status': 'error',
                    'result': 'Usuario no encontrado'
                })
            }
        }
    })

}

exports.authUser = async (req, res) => {
    let user = req.body.username;
    let password = req.body.password;
    params = {
        TableName: "users",
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
            if (data.Items.length > 0) {
                let pass = data.Items[0].password;
                let reqPassword = crypto.createHash('md5').update(password).digest('hex')
                if (pass === reqPassword) {
                    res.status(200).send({
                        'status': 'success',
                        'message': data
                    })
                } else {
                    res.status(401).send({
                        'status': 'error',
                        'message': 'Unauthorized'
                    })
                }

            } else {
                res.status(401).send({
                    'status': 'error',
                    'message': 'Unauthorized'
                })
            }
        }
    });
}