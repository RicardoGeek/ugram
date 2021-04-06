const response = require('./cfn-response');
const aws = require('aws-sdk');
const iam = new aws.IAM();
const lambdaClient = new aws.Lambda({ apiVersion: '2017-04-19' });
exports.handler = function(event, context) {
    const lex = new aws.LexModelBuildingService({ apiVersion: '2017-04-19', region: event.ResourceProperties.lexRegion });
    if (event.RequestType == 'Delete') {
        response.send(event, context, response.SUCCESS);
        return;
    }
    let newSlotTypeParams = [
        
        
        
        
        
        
        
    ];
    let intentParams = [
        
        {
            "name": "recuperar_cuenta" + "_" + process.env.ENV,
            
            
            "sampleUtterances": [
            
                "error al iniciar sesion",
            
                "no puedo iniciar sesion",
            
                "recuperar cuenta",
            
                "olvide contraseña",
            
            ],
        
            "fulfillmentActivity": {
                "type": "ReturnIntent"
            },
        
            "slots": [
                
                {
                    "name": "usuario",
                    "slotConstraint": "Required",
                    "priority": 0,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "cual es su nombre de usuario?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "actualizar",
                    "slotConstraint": "Required",
                    "priority": 1,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "desea restaurar su contraseña?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "envioEmail",
                    "slotConstraint": "Required",
                    "priority": 2,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "en este momento se le envio un correo con los datos necesarios para que pueda actualizar su contraseña",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "advertencia",
                    "slotConstraint": "Required",
                    "priority": 3,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "En este caso la solucion es actualizar su contraseña por lo que le invitamos a realizar este procedimiento",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
            ]
        },
        
        {
            "name": "album_personalizado" + "_" + process.env.ENV,
            
            
            "sampleUtterances": [
            
                "nuevo producto",
            
                "album fisico",
            
                "album personalizado",
            
                "solicitar nuevo producto",
            
            ],
        
            "fulfillmentActivity": {
                "type": "ReturnIntent"
            },
        
            "slots": [
                
                {
                    "name": "solicitud",
                    "slotConstraint": "Required",
                    "priority": 0,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Desea solicitar nuestro nuevo album personalizado?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "city",
                    "slotConstraint": "Required",
                    "priority": 1,
                    "slotType": "AMAZON.Country",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Cual es su pais de residencia?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "celular",
                    "slotConstraint": "Required",
                    "priority": 2,
                    "slotType": "AMAZON.PhoneNumber",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Cual es su numero telefonico?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "tipo",
                    "slotConstraint": "Required",
                    "priority": 3,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Lo desea con pasta dura o edicion cuero?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "fin",
                    "slotConstraint": "Required",
                    "priority": 4,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Su pedido ha sido registrado con exito, nuestro equipo se comunicara con usted para programar la entrega, gracias.",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
            ]
        },
        
        {
            "name": "soporte_fotos" + "_" + process.env.ENV,
            
            
            "sampleUtterances": [
            
                "problema con la foto",
            
                "ayuda en fotos",
            
                "error",
            
                "ayuda",
            
            ],
        
            "fulfillmentActivity": {
                "type": "ReturnIntent"
            },
        
            "slots": [
                
                {
                    "name": "soporteFoto",
                    "slotConstraint": "Required",
                    "priority": 0,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "cual es su nombre de usuario?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "subirFoto",
                    "slotConstraint": "Required",
                    "priority": 1,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "el problema es al subir nueva foto de perfil u otra foto?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "dateFoto",
                    "slotConstraint": "Required",
                    "priority": 2,
                    "slotType": "AMAZON.DATE",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "desde cuando esta presentando el problema?",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
                {
                    "name": "resultFoto",
                    "slotConstraint": "Required",
                    "priority": 3,
                    "slotType": "AMAZON.AlphaNumeric",
                    
                    "valueElicitationPrompt": {
                        "maxAttempts": 3,
                        "messages": [
                            {
                                "content": "Podria iniciar sesion nuevamente por favor si el problema persiste comunicarse al numero +502 22489562 para una asitencia personalizada, gracias",
                                "contentType": "PlainText"
                            }
                        ]
                    }
                },
                
            ]
        },
        
    ];
    let botName = "fotos_app";
    if(process.env.ENV && process.env.ENV !== "NONE") {
      botName = botName + '_' + process.env.ENV;
    }

    let botParams = {
        "name": botName,
        "intents": [
        
            {
                "intentName": "recuperar_cuenta" + "_" + process.env.ENV,
                "intentVersion": "$LATEST"
            },
        
            {
                "intentName": "album_personalizado" + "_" + process.env.ENV,
                "intentVersion": "$LATEST"
            },
        
            {
                "intentName": "soporte_fotos" + "_" + process.env.ENV,
                "intentVersion": "$LATEST"
            },
        
        ],
        "childDirected": false,
        "locale": "en-US",
        "abortStatement": {
            "messages": [
                {
                    "content": "I don't understand. Can you try again?", 
                    "contentType": "PlainText"
                }, 
                {
                    "content": "I'm sorry, I don't understand.", 
                    "contentType": "PlainText"
                }
            ]
        }, 
        "clarificationPrompt": {
            "maxAttempts": 3, 
            "messages": [
                {
                    "content": "I'm sorry, I didn't hear that. Can you repeat what you just said?", 
                    "contentType": "PlainText"
                }, 
                {
                    "content": "Can you say that again?", 
                    "contentType": "PlainText"
                }
            ]
        }, 
        
        
        "idleSessionTTLInSeconds": "300"
        
    };
    
    checkAndCreateLexServiceRole()
    .then(()=>{ return getSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return putSlotTypes(newSlotTypeParams, lex);})
    .then(()=>{ return getIntents(intentParams, lex);})
    .then(()=>{ return putIntents(intentParams, lex);})
    .then(()=>{ return getBot(botParams, lex);})
    .then(()=>{ return putBot(botParams, lex);})
    .then((res) => {
        response.send(event, context, response.SUCCESS, res.ApplicationResponse);
    })
    .catch((err) => {
        console.log(err.stack);
        response.send(event, context, response.FAILED, {Error: err});
        throw err;
    });
};

function checkAndCreateLexServiceRole() {
    
    return checkIfLexServiceRoleExists()
    .then((roleExists) => {
        if(!roleExists) {
            return createNewLexServiceRole();
        }
    });
}

function createNewLexServiceRole() {
 
    // Lex service automatically creates the needed polcies and truust relationships   
    const params = {
      AWSServiceName: 'lex.amazonaws.com',
      Description: 'Allows Amazon Lex to create and manage voice enabled bots on your behalf'
    };
    
    return iam.createServiceLinkedRole(params).promise();
    
}

function checkIfLexServiceRoleExists() {
    let rolePresent;
    
    const params = {
        RoleName: "AWSServiceRoleForLexBots"
    };
    
    return iam.getRole(params).promise()
    .then((result) => {
        rolePresent = true;
        return rolePresent;
    })
    .catch((e) => {
        rolePresent = false;
        return rolePresent;
    });
}

function getSlotTypes(newSlotTypeParams, lex){
    const tasks = []; 
    newSlotTypeParams.forEach( slotType => {
        const params = {
            'name': slotType.name,
            'version': '$LATEST'
        };
        tasks.push(
            lex.getSlotType(params).promise()
            .then((data)=>{
                slotType['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        ); 
    }); 
    return Promise.all(tasks);
}

function putSlotTypes(newSlotTypeParams, lex){
    const tasks = []; 
    newSlotTypeParams.forEach( slotType => {
        tasks.push(
            lex.putSlotType(slotType).promise()
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            })
        );
    }); 
    return Promise.all(tasks);
}

function getIntents(intentParams, lex){
    const tasks = []; 
    intentParams.forEach( intent => {
        const params = {
            'version': '$LATEST',
            'name': intent.name
        };
        tasks.push(
            lex.getIntent(params).promise()
            .then((data)=>{
                intent['checksum'] = data.checksum;
            })
            .catch((err)=>{
            })
        ); 
    });
    return Promise.all(tasks);
}

function putIntents(intentParams, lex){
    const tasks = []; 
    intentParams.forEach( intent => {
        tasks.push(
            ensureLambdaFunctionAccess(intent)
            .then(()=>{
                delete intent.fulfillmentLambda;
                return lex.putIntent(intent).promise();
            })
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            })
        );
    }); 
    return Promise.all(tasks);
}

function ensureLambdaFunctionAccess(intent){
    if(intent.fulfillmentLambda){
        const { 
            region,
            accountId,
            lambdaArn, 
            lambdaName
        } = intent.fulfillmentLambda;

        const params = {
            FunctionName: lambdaName,
            StatementId: `Lex-${intent.name}`+ "a0b846ac",
            Action: 'lambda:InvokeFunction',
            Principal: 'lex.amazonaws.com',
            SourceArn: `arn:aws:lex:${region}:${accountId}:intent:${intent.name}:*`,
        }

        return lambdaClient.addPermission(params).promise()
                .then((data)=>{
                    console.log(data);
                    return data; 
                })
                .catch((err)=>{
                    console.log(err); 
                    throw err; 
                });
    }else{
        return Promise.resolve(undefined);
    }
}

function getBot(botParams, lex){
    params = {
        'name': botParams.name,
        'versionOrAlias': '$LATEST'
    }; 
    return  lex.getBot(params).promise()
            .then((data)=>{
                botParams['checksum'] = data.checksum;
            })
            .catch((err)=>{
            });
}

function putBot(botParams, lex){
    return lex.putBot(botParams).promise()
            .then((data)=>{
                console.log(data);
                return data; 
            })
            .catch((err)=>{
                console.log(err); 
                throw err; 
            });
}