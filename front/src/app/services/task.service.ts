import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Task} from '../models/task';
import {HttpClient, HttpHeaders, HttpResponse, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
import {HandleError} from './service-helper';
import { config } from '../config/config';
import { RessourcesService } from '../providers/ressources.service';
import { DashboardService } from '../providers/dashboard.service';

@Injectable()
export class TaskService {
  taskUrl2 = config.ApiUrl + '/projects';
  constructor(private httpClient: HttpClient,
  public ressources : RessourcesService,
public dashboard : DashboardService) { }

  get(id): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.get(this.taskUrl2 + '/' + id , httpOptions)
      .toPromise()
      .catch(HandleError);
  }
  insert(task: Task, id): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.post(this.taskUrl2 + '/' + id + '/tasks', task, httpOptions)
      .toPromise()
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }

  update(task: Task, id, projectId): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient
      .put(this.taskUrl2 + '/' + projectId + '/tasks/' + id, task, httpOptions)
      .toPromise()
      .then(res => {
        this.ressources.requestDetailRessources(this.dashboard.currentProject.id)
      })
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }

  remove(id: number,projectId): Promise<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    return this.httpClient.delete(this.taskUrl2 + '/' + projectId + '/tasks/' + id, httpOptions)
      .toPromise()
      .catch(err => {
        return Promise.reject(err.error || 'Server error');
      });
  }
}
