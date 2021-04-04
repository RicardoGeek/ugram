const AWS = require('aws-sdk');
const aws_keys = require('../config/creeds.js');

const translate = new AWS.Translate(aws_keys.translation)

exports.doTranslation = (req, res) => {
    const language = req.body.language
    const target = req.body.target
    const text = req.body.text

    const params = {
        SourceLanguageCode: language,
        TargetLanguageCode: target,
        Text: text
    }

    translate.translateText(params, (translationError, data) => {
        if(translationError) {
            res.status(500).send({
                'status': 'error',
                'message': translationError
            })
        }

        res.status(200).send({
            'status': 'success',
            'message': data,
        })
    })
}