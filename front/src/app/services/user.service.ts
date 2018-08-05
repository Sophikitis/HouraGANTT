import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Task} from '../models/task';
import {User} from '../models/user';

import {HttpClient, HttpHeaders, HttpResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {HandleError} from './service-helper';
import { config } from '../config/config';

@Injectable()
export class UserService {
  taskUrl2 = config.ApiUrl + '/me';
  constructor(private httpClient: HttpClient) { }

  get(): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.get(this.taskUrl2, httpOptions)
      .toPromise()
      .catch(HandleError);
  }
  insert(user: User, id): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.post(this.taskUrl2 + '/tasks', user, httpOptions)
      .toPromise()
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }

  update(user: User): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient
      .put(this.taskUrl2 + '/updateprofil', user, httpOptions)
      .toPromise()
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }

  remove(): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.delete(this.taskUrl2 + '/forgotme', httpOptions)
      .toPromise()
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }

  DownloadData(): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.get(this.taskUrl2 + '/downloadme', httpOptions)
      .toPromise()
      .catch(HandleError);
  }
}
