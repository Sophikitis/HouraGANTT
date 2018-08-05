import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { config } from '../config/config';

interface Iresource{
  data;
}

@Injectable()
export class RessourcesService {
  public btnRessourcesClicked:boolean  = false;
  private apiUrl = config.ApiUrl;

  constructor(
    public dash : DashboardService,
    public http:HttpClient
  )
  {

  }

  displayRessources(data:boolean){

    console.log("here")

    if(data){
      this.btnRessourcesClicked = false;
      this.dash.currentProject  = this.dash.currentProject

    }else{
      this.btnRessourcesClicked = true

    }



    console.log("out", this.btnRessourcesClicked)

  }



 requestCreateRessources(form:any):Promise<boolean>{

  let httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  let currentProjectID = this.dash.currentProject.id

  let pkg = {
    name : form.nameCtrl,
    first_name : form.first_nameCtrl,
    job : form.jobCtrl,
    ratio : form.ratioCtrl,
    project_id : currentProjectID,
  }

  let urlCreateRessources : string = this.apiUrl+'/projects/'+currentProjectID+'/resources';

  return this.http.post(urlCreateRessources, pkg, httpOptions)
  .toPromise()
  .then(res => {
    console.log(res);
    return true
  },err =>{
    console.log(err);

    return false
  })

 }
public projectRessource
 requestResourcesProject(currentProject){

  console.log(currentProject)
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };
  let currentProjectID = currentProject

  let urlgetRessources : string = this.apiUrl+'/projects/'+currentProjectID+'/resources';

  this.http.get<Iresource>(urlgetRessources, httpOptions).subscribe(res => {
    console.log(res);
    this.projectRessource = res.data;
    console.log('!!!!', this.projectRessource);

  },err => {
    console.log(err);

  })
 }

 public projectRessourceDetail
 requestDetailRessources(currentProject){
   console.log('!!zero!!', currentProject);

   let httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  let currentProjectID = currentProject

  let urlgetRessourcesDetail : string = this.apiUrl+'/project/'+currentProjectID+'/resourceDetail';

  this.http.get<Iresource>(urlgetRessourcesDetail, httpOptions).subscribe(res => {

    console.log('!!one!!',res);
    this.projectRessourceDetail = res.data;

    console.log('!!two!!',this.projectRessourceDetail);



  },err => {
    console.log('!!!!', err);

  })
 }

 public deletedRess = false;
 requestDeleteRessource(idProject, idresource):Promise<boolean>{

  let httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

  let currentProjectID = idProject
  let resourceSelected = idresource



  let urlDeleteResources : string = this.apiUrl+'/projects/'+currentProjectID+'/resources/'+resourceSelected;


  return this.http.delete<Iresource>(urlDeleteResources, httpOptions)
  .toPromise()
  .then(res => {

    console.log('delete Resource', res);
    this.deletedRess = true; 
    return true

  },err => {
    console.log('!!pol!!', err);

    return false
  })
 }

 requestUpdateRessources(form:any, idresource):Promise<boolean>{
  let httpOptions = {
    headers: new HttpHeaders({
      'Accept':  'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };

let currentProjectID = this.dash.currentProject.id
let resourceSelected = idresource


let pkg = {
  name : form.nameCtrl2,
  job : form.jobCtrl2,
  ratio : form.ratioCtrl2,
}


let urlEditRessources : string = this.apiUrl+'/projects/'+currentProjectID+'/resources/'+resourceSelected;


return this.http.put<Iresource>(urlEditRessources, pkg,  httpOptions)
  .toPromise()
  .then(res => {
    this.deletedRess = true; 

    console.log('update res', res);
    return true

  },err => {
    console.log('update res', err);

    return false
  })
}




}
