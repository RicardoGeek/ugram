import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  httpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  createAlbum(album: Album): Observable<any> {
    return this.http.post(this.baseUrl + '/album', album, this.httpOptions());
  }

  updateAlbum(user: String, albumId: String, album: Album): Observable<any> {
    return this.http.post(this.baseUrl + '/album/' + user + '/' + albumId + '/update', album, this.httpOptions());
  }

  getUserAlbum(user: String) {
    return this.http.get(this.baseUrl + '/album/' + user, this.httpOptions());
  }

  deleteAlbum(user: String, albumId: String): Observable<any>{
    return this.http.delete(this.baseUrl + '/' + user + '/' + albumId + '/delete');
  }
}
