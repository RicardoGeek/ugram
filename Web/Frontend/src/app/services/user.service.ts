import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  httpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.baseUrl + '/user', user, this.httpOptions());
  }

  getUser(username: String): Observable<any> {
    return this.http.get(this.baseUrl + '/user/' + username, this.httpOptions());
  }

  updateUser(username:String, newUser: User): Observable<any> {
    return this.http.post(this.baseUrl + '/user/' + username + '/update', newUser, this.httpOptions());
  }

  login(user: any): Observable<any> {
    return this.http.post(this.baseUrl+ '/auth', user, this.httpOptions());
  }


}
