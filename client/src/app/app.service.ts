import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Messages } from './messages/messages.model';

@Injectable()
export class AppService {
  accessToken = '';
  constructor(private http: HttpClient) { }

  //set the access token in a variable and can be used across application
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  //To fetch the access token
  getAccessToken(): string {
    return this.accessToken;
  }

  //Service to fetch create message
  createMessage(text: string): Observable<Messages> {
    return this.http.post<Messages>('/createMessage', { text });
  }

  //Service to get list of messages
  getAllMessages(): Observable<{ items: Messages[] }> {
    return this.http.get<{ items: Messages[] }>('/messagesList');
  }

  //Service to get message details of a particular message
  getMessageDetails(id: string): Observable<Messages> {
    return this.http.get<Messages>('/messageDetails/' + id);
  }

  //Service to get own details
  getOwnDetails(): Observable<any> {
    return this.http.get<any>('/ownDetails');
  }

  //Service to delete a message
  deleteMessage(id: string): Observable<any> {
    return this.http.delete('/deleteMessage/' + id);
  }

  //Service to get access_token from server and can be used when refreshing the page
  getAuthToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>('/getAuthToken');
  }

  //Service to logout of application
  logout(): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/logout', null);
  }
}