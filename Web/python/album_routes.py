from server import app, request
from utils import albums_helper

@app.route('/album', methods=['POST'])
def createAlbum():
    request.get_json(force = True)
    data = request.json

    id_album = data['id_album']
    user = data['user_name']
    album_name = data['album_name']

    validation = albums_helper.validate(id_album,  album_name, user)

    if len(validation) > 0:
        return {
            'status': 'error',
            'errors': validation
        }, 400

    albumCreated = albums_helper.create_album(id_album, album_name, user)

    if albumCreated['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': albumCreated
        }, 500
    
    return {
        'status': 'success',
        'message': albumCreated
    }, 200

@app.route('/album/<user_name>', methods=['GET'])
def getAlbums(user_name):
    albums = albums_helper.get_user_albums(user_name)

    return {
        'status': 'success',
        'albums': albums
    }, 200

@app.route('/album/<user_id>/<id_album>/update', methods=['POST'])
def updateAlbum(user_id, id_album):
    request.get_json(force = True)
    data = request.json

    album_name = data['album_name']

    updateResult = albums_helper.update_user_album(id_album, user_id, album_name)

    if updateResult['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': updateResult
        }, 500
    
    return {
        'status': 'success',
        'message': updateResult
    }, 200

@app.route('/album/<user_id>/<album_id>/delete', methods=['DELETE'])
def deleteAlbum(user_id, album_id):
    deletionResult = albums_helper.delete_album(album_id, user_id)

    if deletionResult['ResponseMetadata']['HTTPStatusCode'] != 200:
        return {
            'status': 'error',
            'message': deletionResult
        }, 500
    
    return {
        'status': 'success',
        'message': deletionResult
    }, 200
