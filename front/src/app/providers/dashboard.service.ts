import { Injectable, Input} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseContentType, RequestOptions, Headers } from '@angular/http'
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { resolve } from 'dns';
import {Observable} from 'rxjs';
import { config } from '../config/config';
// CONST
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Accept':  'application/json',
//     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
//   })
// };

const { ipcRenderer } = require('electron')

// INTERFACE


interface Ipro extends IProject{
  projects?: Array<object>, 
  email?:string,
  first_name?:string,
  last_name?:string
}
interface IProject {
  data;
}


@Injectable()
export class DashboardService{
  // DECLARATIONS VARIABLES
  apiUrl = config.ApiUrl;

  public projectsUser=[]
  @Input() public currentProject;
  public WriteOk
  public selectedProject : boolean = false;
  public viewCalendar:string = "month";
  @Input() public user:object = {
    first_name : '',
    last_name :''
  }

  constructor(
    public http:HttpClient,
  ) { }

  // TODO : JSDOC
  getAllProjects(){
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

 

    let urlGetAllProjects : string = this.apiUrl+'/me';
    this.projectsUser = [];
  

    this.http.get<Ipro>(urlGetAllProjects,httpOptions).subscribe(res => {
      console.log("urlGetAllProjects | ok ", res)

      // USER INFORMATIONS
      this.user = {
        email : res.data.email, 
        first_name : res.data.first_name, 
        last_name : res.data.last_name
      }

      console.log('test', this.user)

      // PROJECTS
      if(res.data.projects.length > 0){

        res.data.projects.forEach(element => {
          this.projectsUser.push(element)
        });
        // this.currentProject = this.projectsUser[0].projects;
      }
    },err => {
      console.log("urlGetAllProjects | Erreur", err)
    });
  }


  requestEditProject(form:any):Promise<boolean>{

    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };
    console.log("!!!dd!", form);
    
    let pkg = {
      name : form.nameCtrl2,
      duration_days : form.duration_daysCtrl2,
      description : form.descriptionCtrl2,
      link : form.linksCtrl2,
      billing : null,
    }

    let idProject = this.currentProject.id
    let urlEditProject : string = this.apiUrl+'/projects/'+idProject;

    return this.http.put(urlEditProject, pkg, httpOptions)
    .toPromise()
    .then(res =>{
      console.log("edit project res", res);
      return true
    }, err =>{
      console.log("Edit project erreur", err);
      
      return false
    })

  }

  public deletedPro = false
  requestDeleteProject(idProject):Promise<boolean>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };


    let urlDeleteProject  : string = this.apiUrl+'/projects/'+idProject;

    return this.http.delete(urlDeleteProject, httpOptions)
    .toPromise()
    .then(res =>{
      this.deletedPro = true;
      return true 
    }, err => {
      return false
    })
  }







  // TODO : JSDOC
  requestCreateProject(form: any):Promise<boolean>{

    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

 

    console.log('!!!!TOKEN!!!!', localStorage.getItem('access_token'))
    let pkg = {
      name : form.nameCtrl,
      duration_days : form.duration_daysCtrl,
      description : form.descriptionCtrl,
      link : form.linksCtrl,
      billing : "data",
    }

    let urlCreateProject : string = this.apiUrl+'/projects';


    return this.http.post(urlCreateProject,pkg,httpOptions)
          .toPromise()
          .then(res => {
                        console.log('!!!RES!!!', res);
                        
                        return true;
                    }, err => {
                      console.log('!!!!ERR!!!!', err);
                      return false
                    })

  }

  requestInvite(form: any):Promise<boolean>{

    let httpOptions = {
      headers: new HttpHeaders({
        'Accept':  'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
      })
    };

 

    console.log('!!!!TOKEN!!!!', localStorage.getItem('access_token'))
    let pkg = {
      user_email : form.emailCtrl,
    }

    let urlCreateProject : string = this.apiUrl+'/projects/'+this.currentProject.id+'/invite';


    return this.http.post(urlCreateProject,pkg,httpOptions)
          .toPromise()
          .then(res => {
                        console.log('!!!RES!!!', res);
                        
                        return true;
                    }, err => {
                      console.log('!!!!ERR!!!!', err);
                      return false
                    })

  }



  selectProject(idProj){

    if(idProj > 0)
    {
      for (let index = 0; index < this.projectsUser.length; index++) {
        if(this.projectsUser[index].id == idProj)
       {
         this.currentProject = this.projectsUser[index]
         this.selectedProject= true;
       }

      }
    }
    console.log("Projet selectionné", this.currentProject);
  //   //location.reload();
  //   this.router.navigate(['dashboard/' + this.currentProject.id]);
  //  // console.log("Projet");
  }



requestExportPdf(idProject:string){

  let httpOptions = {
    headers: new HttpHeaders({
      'content-type':  'application/pdf',
      'content-Disposition':'attachment; filename="download.pdf"',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    })
  };


  let urlRequestExportPdf : string = this.apiUrl+'/project/'+idProject+'/downloadPDF';





  this.http.get(urlRequestExportPdf, httpOptions).subscribe(res=>{
    console.log('!!!export',res)
    ipcRenderer.send('download-btn', res)
  },err => {
    console.log('!!!export err', err);
    ipcRenderer.send('download-btn', err)
    
  })


}




// downloadFile(id): Observable<Blob> {
//   let head = new Headers

//   head.append('Authorization', localStorage.getItem('access_token' )
  
  
//   // = {
//   //   headers: new Headers({
     
//   //     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
//   //   })
//   // };

//   let options = new RequestOptions({responseType: ResponseContentType.Blob, headers: head });
//   let urlRequestExportPdf : string = this.apiUrl+'/project/'+id+'/downloadPDF';

//   return this.http.get(this._baseUrl + '/' + id, options)
//       .map(res => res.blob())
//       .catch(this.handleError)
// }








  ngOnDestroy() {



    
 }

}
