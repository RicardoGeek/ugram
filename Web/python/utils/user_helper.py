import boto3
from boto3.dynamodb.conditions import Key
import bcrypt

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamoClient = boto3.client('dynamodb', region_name='us-east-1')

# METODOS PUBLICOS
def validate(user_name, fullname, password):
    errors = []
    
    if user_name.find(' ', 0, len(user_name)) != -1:
        errors.append('El nombre de usuario no debe contener espacios')

    if not user_name:
        errors.append('El nombre de usuario es requerido')
    
    if not fullname:
        errors.append('El nombre completo es requerido')
    
    if not password:
        errors.append('El password es requerido')
    
    table = dynamodb.Table('users')    
    userData = table.scan()

    if not isUnique(user_name, userData):
        errors.append('Ese nombre de usuario ya esta en uso')

    return errors

def validate_update(fullname, password):
    errors = []
    
    if not fullname:
        errors.append('El nombre completo es requerido')
    
    if not password:
        errors.append('El password es requerido')
    
    return errors

def create_user(user_name, fullname, password):
    table = dynamodb.Table('users')
    response = table.put_item(
        Item = {
            'user_name': user_name,
            'fullname': fullname,
            'password': password
        }
    )
    return response

def getUser(user_name):
    table = dynamodb.Table('users')
    userData = table.scan()
    return filterUser(user_name, userData)

def updateUser(user_name, fullname, password):
    table = dynamodb.Table('users')
    updateResult = table.update_item(
        Key = {
            'user_name': user_name
        },
        UpdateExpression = 'set fullname=:fn, password=:p',
        ExpressionAttributeValues = {
            ':fn': fullname,
            ':p': password
        },
        ReturnValues = "UPDATED_NEW"
    )

    return updateResult

def user_auth(user_name, password):
    table = dynamodb.Table('users')
    allUsers = table.scan()
    filteredUser = seekUser(user_name, password, allUsers)
    
    return filteredUser

# METODOS PRIVADOS (not really)
def filterUser(user_name, userData):
    data = userData['Items']
    for user in data:
        if user_name == user['user_name']:
            return user
    return None

def isUnique(user_name, users):
    data = users['Items']
    for user in data:
        if user_name == user['user_name']:
            return False
    return True

def seekUser(user_name, password, userData):
    data = userData['Items']
    hashed = bcrypt.hashpw(password, bcrypt.gensalt())
    for user in data:
        if user_name == user['user'] and bcrypt.checkpw(password, user['password']):
            return user
    return None