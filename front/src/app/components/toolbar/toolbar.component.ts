import { Component, OnInit, EventEmitter, Input, Output, Injectable} from '@angular/core';
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';
import { Location } from '@angular/common';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from "rxjs"
// SERVICES
import { DashboardService } from '../../providers/dashboard.service';
import { RessourcesService } from '../../providers/ressources.service';
import { ElectronService } from '../../providers/electron.service';


// TODO : A SUPPRIMER SI SERVICE OK
// const httpOptions = {
//   headers: new HttpHeaders({
//     'Accept':  'application/json',
//     'Authorization': 'Bearer ' + localStorage.getItem('access_token')
//   })
// };

// interface IProject {
//   data:Array<object>;
// }
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
@Injectable()
export class ToolbarComponent implements OnInit{
  selectedOption = "";
  selectedOptions = "";
  selectOption = [];

  // // GOUP FORM
  UpdateProfilForm : FormGroup;

  first_name : FormControl;
  last_name : FormControl;
  password : FormControl;
  avatar : FormControl;
  // DECLARATIONS
  DataProfil = {} as User;
  first_name_required:boolean = false;
  password_valid:boolean = false;
  public loggedIn: boolean;

  public modalActionsProfil = new EventEmitter<string|MaterializeAction>();
  // public modalActions2 = new EventEmitter<string|MaterializeAction>();

  // private apiUrl:string = "http://192.168.33.10/api";
  // public projectsUser=[]
  // public currentProject;

  // public selectedProject :boolean = false;
  // public createFormAddProject : FormGroup;
  constructor(
    public http:HttpClient,
    public router:Router,
    private location: Location,
    public dashboard:DashboardService,
    public ressources: RessourcesService,
    public UserService:UserService,
    public electronService: ElectronService,
    private Auth: AuthService,
    private Token: TokenService,
  ) {
    // !! VERIF SI AU NIVEAU DES DECLARATIONS CA MARCHE TOUJOURS
    // !! SINON DECOMMENTER
   this.modalActionsProfil = new EventEmitter<string|MaterializeAction>();
    // this.modalActions2 = new EventEmitter<string|MaterializeAction>();

    // RECUPERE TOUS LES PROJETS
    // VARIABLE A UTILISER DANS HTML
    // dashboard.projectsUser
    this.dashboard.getAllProjects();

   }



  ngOnInit() {
   /* this.model.last_name = this.dashboard.user.last_name
    this.model.first_name = this.dashboard.user.first_name
    this.model.email = this.dashboard.user.email;*/
    this.Auth.authStatus.subscribe(value => this.loggedIn = value);
    this.getUserData();
    // this.createFormControl()
    // this.createFormAddProjects()
   
  }

  getUserData(){
    Promise.all([this.UserService.get()])
      .then(([data]) => {
        console.log(data);
        delete data.data.projects;
        this.DataProfil = data.data;
        this.DataProfil['password'] = "";
      });
  }

  logout(){
    event.preventDefault();
    this.ressources.btnRessourcesClicked = false;
    this.Token.remove();
    this.Auth.changeAuthStatus(false);
    this.router.navigate(['login']);
    this.dashboard.selectedProject = false;
  }

  saveProfile() {
    console.log(this.DataProfil);

    if(this.DataProfil.first_name.length <= 3 || this.DataProfil.first_name == ""){
      console.log("dfdfd")
      this.first_name_required = true;
      return false;
    }

    if(this.DataProfil.password !=''){
      if (this.DataProfil.password.match(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)){
        this.password_valid = false;
      }else {
        this.password_valid = true;
        return false;
      }
    }
      this.UserService.update(this.DataProfil)
        .then((response) => {
        });
      this.getUserData();
      this.first_name_required = false;
      this.password_valid = false;
      this.closeModalProfil();
      }


  Mydata() {
    Promise.all([this.UserService.DownloadData()])
      .then(([data]) => {
        window.open(data.data);
      });
  }
  deleteData() {
    if (window.confirm('etes vous sur de vouloir supprimer toute vos données? cette action vas vous deconnecter de votre session')) {
      Promise.all([this.UserService.remove()])
        .then(([data]) => {
          if(data.status === 'sucess') {
            event.preventDefault();
            this.ressources.btnRessourcesClicked = false;
            this.Token.remove();
            this.Auth.changeAuthStatus(false);
            this.router.navigateByUrl('/login');
          }
        });
    } else {
      console.log('no');
    }
  }

  // TODO A SUPPRIMER SI SERVICE OK
  // getAllProjects(){

  //   let urlGetAllProjects : string = this.apiUrl+'/projects';
  //   this.projectsUser = [];

  //   this.http.get<IProject>(urlGetAllProjects).subscribe(res => {
  //     console.log("urlGetAllProjects | ok ", res)

  //     if(res.data.length > 0){
  //       res.data.forEach(element => {
  //         this.projectsUser.push(element)
  //       });
  //       this.currentProject = this.projectsUser[0];
  //     }

  //   },err => {
  //     console.log("urlGetAllProjects | Erreur", err)
  //   });

  // }

  // // TODO :  RENOMMER FONCTIONS
  // // MODAL INFOS
  // openModal2() {
  //   this.modalActions2.emit({action:"modal",params:['open']});
  // }
  // closeModal2() {
  //   this.modalActions2.emit({action:"modal",params:['close']});
  // }
  // // MODAL CREATION PROJET
  openModalProfil() {
  this.modalActionsProfil.emit({action:"modal",params:['open']});
  }
  closeModalProfil() {
     this.modalActionsProfil.emit({action:"modal",params:['close']});
 }

  // TODO : A SUPPRIMER SI SERVICE OK
  // requestCreateProject(form: any): void {


  //   let pkg = {
  //     name : form.nameCtrl,
  //     duration_days : form.duration_daysCtrl,
  //     description : form.descriptionCtrl,
  //     link : form.linksCtrl,
  //     billing : "data",
  //   }

  //   let urlCreateProject : string = this.apiUrl+'/projects';


  //   this.http.post(urlCreateProject,pkg,httpOptions)
  //   .subscribe(res => {

  //     console.log("requestCreateProject ok ", res)
  //     this.closeModal()
  //     this.formAddProject.reset()
  //     this.getAllProjects()

  //   },err => {
  //     console.log("requestCreateProject | Erreur", err)

  //   })


  // }





  // // TODO : JS DOC
  // createProject(form){

  //   this.dashboard.requestCreateProject(form).then(res => {
  //     if(res){
  //       this.formAddProject.reset()
  //       this.dashboard.getAllProjects()
  //       this.closeModal()
  //     }
  //   })

  // }


  // selectProject(idProj){

  //   if(idProj > 0)
  //   {
  //     for (let index = 0; index < this.dashboard.projectsUser.length; index++) {
  //       if(this.dashboard.projectsUser[index].id == idProj)
  //      {
  //        this.dashboard.currentProject = this.dashboard.projectsUser[index]
  //        this.dashboard.selectedProject= true;
  //      }

  //     }
  //   }
  //   console.log("Projet selectionné", this.dashboard.currentProject);
  // //   //location.reload();
  // //   this.router.navigate(['dashboard/' + this.currentProject.id]);
  // //  // console.log("Projet");
  // }




UpdateViewCalendar(data){

  // GANTT VIEW CALENDAR
  let day = document.getElementById('day');
  let month = document.getElementById('month');
  let years = document.getElementById('years');

  // SWITCH VIEW GANTT - SPRINT

  let gantt = document.getElementById('gantt');
  let sprint = document.getElementById('sprint');

  switch (data) {
    case 'day':
      console.log("select calendar", data);

      day.classList.add('selected')
      month.classList.remove('selected')
      years.classList.remove('selected')

      this.dashboard.viewCalendar = data;
      console.log('out select calendar', this.dashboard.viewCalendar);


      break;

    case 'month':
    console.log("select calendar", data);

    if(!month.classList.contains(data)){

      month.classList.add('selected')
      day.classList.remove('selected')
      years.classList.remove('selected')

      this.dashboard.viewCalendar = data;
      console.log('out select calendar', this.dashboard.viewCalendar);
    }

      break;

    case 'year':
    console.log("select calendar", data);

    years.classList.add('selected')
    month.classList.remove('selected')
    day.classList.remove('selected')

    this.dashboard.viewCalendar = data;
    console.log('out select calendar', this.dashboard.viewCalendar);


      break;

      case 'gantt':
      console.log("selected", data);

      gantt.classList.add('selected')
      sprint.classList.remove('selected')
      this.ressources.displayRessources(true)

      // this.dashboard.viewCalendar = data;
      console.log('out select calendar', this.dashboard.viewCalendar);


        break;

        case 'sprint':
      console.log("selected", data);

      gantt.classList.remove('selected')
      sprint.classList.add('selected')
      this.ressources.displayRessources(false)
      // this.dashboard.viewCalendar = data;
      console.log('out select calendar', this.dashboard.viewCalendar);
        break;
    default:
      break;
  }
}



}
