import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamoClient = boto3.client('dynamodb', region_name='us-east-1')

def validate(id_album, album_name, user_name):
    errors = []

    if not id_album:
        errors.append('El id del album no puede estar vacio')

    if not album_name:
        errors.append('El nombre del album no puede estar vacio')
    
    if not user_name:
        errors.append('El nombre de usuario no puede estar vacio')
    
    return errors

def create_album(id_album, album_name, user_name):
    table = dynamodb.Table('albumes')
    response = table.put_item(
        Item = {
            'user_name': user_name,
            'id_album': id_album,
            'album_name': album_name
        }
    )
    return response

def get_user_albums(user_name):
    table = dynamodb.Table('albumes')
    albumsData = table.scan()
    return filterAlbumData(user_name, albumsData)

def update_user_album(id_album, user_name, album_name):
    table = dynamodb.Table('albumes')
    updatedAlbum = table.update_item(
        Key = {
            'id_album': id_album
        },
        UpdateExpression = 'set album_name=:an',
        ExpressionAttributeValues = {
            ':an': album_name
        },
        ReturnValues = "UPDATED_NEW"
    )

    return updatedAlbum

def delete_album(id_album, user_name):
    table = dynamodb.Table('albumes')
    deleteResponse = table.delete_item(
        Key = {
            'id_album': id_album
        },
         ConditionExpression="user_name = :u",
        ExpressionAttributeValues={
            ":u": user_name
        }
    )

    return deleteResponse

# METODOS PRIVADOS (not really)
def filterAlbumData(user_name, album_data):
    albums = album_data["Items"]
    your_albums = []
    for album in albums:
        if album['user_name'] == user_name:
            your_albums.append(album)
    return your_albums