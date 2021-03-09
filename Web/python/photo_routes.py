from server import app, request
from utils import photos_helper

@app.route('/photos', methods=['POST'])
def createPhoto():
    request.get_json(force = True)
    data = request.json

    id_photo = data['id_photo']
    id_album = data['id_album']
    id_user = data['id_user']
    caption = data['caption']
    url = data['url']

    photoCreated = photos_helper.create_photo(id_photo, id_album, id_user, caption, url)

    if photoCreated['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': photoCreated
        }, 500
    
    return {
        'status': 'success',
        'message': photoCreated
    }, 200

@app.route('/photos/<id_photo>/update', methods=['POST'])
def updatePhoto(id_photo):
    request.get_json(force = True)
    data = request.json

    caption = data['caption']
    url = data['url']

    updateResult = photos_helper.update_photo(id_photo, url, caption)

    if updateResult['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': updateResult
        }, 500
    
    return {
        'status': 'success',
        'message': updateResult
    }, 200

@app.route('/photos/<id_user>', methods=['GET'])
def getUserPhotos(id_user):
    photos = photos_helper.get_all_user_photos(id_user)

    return {
        'status': 'success',
        'message': photos
    }, 200

@app.route('/photos/<id_user>/<id_album>', methods=['GET'])
def getUserPhotosByAlbums(id_user, id_album):
    photos = photos_helper.get_user_photos_by_album(id_user, id_album)

    return {
        'status': 'success',
        'message': photos
    }, 200

@app.route('/photos/<path:id_photo>', methods=['DELETE'])
def deletePhoto(id_photo):
    request.get_json(force = True)
    data = request.json

    user = data['user_id']

    deletionResult = photos_helper.delete_photo(id_photo, user)
    
    if deletionResult['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': deletionResult
        }, 500
    
    return {
        'status': 'success',
        'message': deletionResult
    }, 200