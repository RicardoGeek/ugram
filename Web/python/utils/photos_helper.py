import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamoClient = boto3.client('dynamodb', region_name='us-east-1')


def create_photo(id_photo, id_album, id_user, caption, url):
    table = dynamodb.Table('photos')
    response = table.put_item(
        Item = {
            'id_photo': id_photo,
            'id_album': id_album,
            'id_user': id_user,
            'caption': caption,
            'url': url
        }
    )

    return response

def update_photo(id_photo, url, caption):
    table = dynamodb.Table('photos')
    updatedPhoto = table.update_item(
        Key = {
            'id_photo': id_photo
        },
        UpdateExpression = 'set caption=:c, #url=:u',
        ExpressionAttributeValues = {
            ':c': caption,
            ':u': url
        },
        ExpressionAttributeNames = {
            "#url": "url"
        },
        ReturnValues = "UPDATED_NEW"
    )

    return updatedPhoto

def get_user_photos_by_album(user_name, album_id):
    table = dynamodb.Table('photos')
    photosData = table.scan()
    filtered_photos = filter_user_fotos_by_album(user_name, album_id, photosData)

    return filtered_photos

def get_all_user_photos(user_name):
    table = dynamodb.Table('photos')
    photosData = table.scan()
    filtered_photos = filter_user_fotos(user_name, photosData)

    return filtered_photos

def delete_photo(id_photo, user_name):
    table = dynamodb.Table('photos')
    deleteResponse = table.delete_item(
        Key = {
            'id_photo': id_photo
        },
        ConditionExpression="id_user = :u",
        ExpressionAttributeValues={
            ":u": user_name
        }
    )

    return deleteResponse

# PRIVATES
def filter_user_fotos_by_album(user_name, album_id, photos_data):
    photos = photos_data['Items']
    your_photos = []
    for photo in photos:
        if user_name == photo['id_user'] and album_id == photo['id_album']:
            your_photos.append(photo)

    return your_photos


def filter_user_fotos(user_name, photos_data):
    photos = photos_data['Items']
    your_photos = []
    for photo in photos:
        if user_name == photo['id_user']:
            your_photos.append(photo)

    return your_photos