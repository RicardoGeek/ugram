var AWS = require('aws-sdk');
var aws_keys = require('../config/creeds.js');
var bcrypt = require('bcrypt');


const dynamo = new AWS.DynamoDB.DocumentClient(aws_keys.dynamodb);


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
                'password': bcrypt.hashSync(body.password, 10)
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
                ':p': body.password
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
                if (bcrypt.compareSync(password, pass)) {
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