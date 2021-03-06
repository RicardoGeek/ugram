from server import app, request
from utils import user_helper
import bcrypt

@app.route('/user', methods=['POST'])
def createUser():
    request.get_json(force = True)
    data = request.json
    
    username = data['user_name']
    fullname = data['fullname']
    password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    validation = user_helper.validate(username, fullname, password)
    
    if len(validation) > 0:
        return {
            'status': 'error',
            'errors': validation
        }, 400
    
    userCreated = user_helper.create_user(username, fullname, password)
    
    if userCreated['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': userCreated
        }, 500
    
    return {
        'status': 'success',
        'message': userCreated
    }, 200

@app.route('/user/<user_name>', methods=['GET'])
def getUser(user_name):
    userData = user_helper.getUser(user_name)

    if not userData:
        return {
            'status': 'error',
            'message': 'Usuario no encontrado'
        }, 404
    
    return userData

@app.route('/user/<user_name>/update', methods=['POST'])
def updateUser(user_name):
    request.get_json(force = True)
    data = request.json
    
    fullname = data['fullname']
    password = data['password']

    validation = user_helper.validate_update(fullname, password)

    if len(validation) > 0:
        return {
            'status': 'error',
            'errors': validation
        }, 400
    
    updatedResult = user_helper.updateUser(user_name, fullname, password)

    if updatedResult['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': updatedResult
        }, 500

    return {
        'status': 'success',
        'message': updatedResult['Attributes']
    }, 200

@app.route('/auth', methods=['POST'])
def authUser():
    request.get_json(force = True)
    data = request.json

    username = data['username']
    password = data['password'].encode('utf-8')

    user = user_helper.user_auth(username, password)

    if not user:
        return {
            'status': 'error',
            'message': 'Unauthorized'
        }, 401
    
    return {
        'status': 'success',
        'message': user
    }, 200