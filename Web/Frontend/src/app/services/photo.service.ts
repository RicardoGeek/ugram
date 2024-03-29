import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Photo } from '../models/photo';
import { PhotoS3 } from '../models/photoS3';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  httpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  createPhoto(foto: Photo): Observable<any> {
    return this.http.post(this.baseUrl + '/photos', foto, this.httpOptions());
  }

  updatePhoto(idFoto: String, foto: Photo): Observable<any> {
    return this.http.post(this.baseUrl + '/photos/' + idFoto + '/update', foto, this.httpOptions());
  }


  getUserPhotos(user: String): Observable<any> {
    return this.http.get(this.baseUrl + '/photos/' + user, this.httpOptions());
  }

  getPhotosByAlbum(user: String, albumId: String): Observable<any> {
    return this.http.get(this.baseUrl + '/photos/' + user + '/' + albumId, this.httpOptions());
  }

  deletePhoto(id: string, user:any): Observable<any> {
    let headers =  new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.request('delete',this.baseUrl + '/photos/' + encodeURIComponent(id), {body: user, headers: headers});
  }

  save(photo: PhotoS3): Observable<any> {
    return this.http.post(this.baseUrl + '/save', photo, this.httpOptions());
  }

  upload(file): Observable<any> {
    const formdata = new FormData();
    formdata.append('file', file);

    return this.http.post(this.baseUrl + '/upload', formdata);
  }

  tagPhoto(idPhoto): Observable<any>{
    return this.http.post(this.baseUrl + '/photos/tag', {photo: idPhoto}, this.httpOptions());
  }

  getText(url: string): Observable<any>{
    return this.http.post(this.baseUrl + '/photos/getText', {foto: url}, this.httpOptions());
  }
}
