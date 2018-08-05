import { Component, OnInit, EventEmitter, AfterViewChecked } from '@angular/core';
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";
import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';
import * as $ from 'jquery';

// SERVICES
import { DashboardService } from '../../providers/dashboard.service';
import { RessourcesService } from '../../providers/ressources.service';


@Component({
  selector: 'app-ressources',
  templateUrl: './ressources.component.html',
  styleUrls: ['./ressources.component.scss']
})
export class RessourcesComponent implements OnInit {

  constructor(
    public ressources:RessourcesService,
    public dashboard:DashboardService
  ) { }


  // MODAL
  public modalActions3 = new EventEmitter<string|MaterializeAction>();
  public confirmDeleteRes = new EventEmitter<string|MaterializeAction>();
  public EditRess = new EventEmitter<string|MaterializeAction>();

// GOUP FORM
  formAddRessources : FormGroup;
  formEditRessources : FormGroup;

  // FORM CONTROLS
  nameCtrl        : FormControl;
  first_nameCtrl  : FormControl;
  ratioCtrl       : FormControl;
  jobCtrl         : FormControl;
  
  nameCtrl2       : FormControl;
  first_nameCtrl2  : FormControl;
  ratioCtrl2       : FormControl;
  jobCtrl2         : FormControl;

 





  ngOnInit() {
    this.createFormControl()
    this.createFormAddProjects()
    this.createFormEditProject()


    // $(document).ready(function() {
    //       $('#test').on('click', function() {
    //           console.log('test', $(this).text())
    //       })
    //   })

  }
  //   $(document).ready(function() {
  //     $('.table').on('click', function() {
  //         console.log('test', $(this).text())
  //     })
  // })
  // }



  openModalEditRess() {
    this.EditRess.emit({action:"modal",params:['open']});
  }
  closeModalEditRess() {
    this.EditRess.emit({action:"modal",params:['close']});
  }



  openModal3() {
    this.modalActions3.emit({action:"modal",params:['open']});
  }
  closeModal3() {
    this.modalActions3.emit({action:"modal",params:['close']});
  }


  openModalResConfirmDel(){
    this.confirmDeleteRes.emit({action:"modal",params:['open']});
  }

  closeModalResConfirmDel(){
    this.confirmDeleteRes.emit({action:"modal",params:['close']});
  }


    // === CREATION FORMULAIRE ET VALIDATORS === //
    createFormControl(){
      this.nameCtrl = new FormControl('', [
        Validators.required
      ]);

      this.first_nameCtrl = new FormControl('', [
        Validators.required
      ]);
  
      this.jobCtrl = new FormControl('', [
        Validators.required
      ]);
  
      this.ratioCtrl = new FormControl('', [
        Validators.required
      ]);
      
      this.nameCtrl2= new FormControl('', [
        Validators.required
      ]);

      this.first_nameCtrl2 = new FormControl('', [
        Validators.required
      ]);
  
      this.jobCtrl2 = new FormControl('', [
        Validators.required
      ]);
  
      this.ratioCtrl2 = new FormControl('', [
        Validators.required
      ]);
    }

    createFormEditProject(){

      this.formEditRessources = new FormGroup({
        nameCtrl2:this.nameCtrl2,
        jobCtrl2:this.jobCtrl2,
        ratioCtrl2:this.ratioCtrl2
      })



    }
    createFormAddProjects() {
      this.formAddRessources = new FormGroup({
        nameCtrl: this.nameCtrl,
        first_nameCtrl: this.first_nameCtrl,
        jobCtrl: this.jobCtrl,
        ratioCtrl: this.ratioCtrl
      });
    }
    // === FIN CREATION FORMULAIRE ET VALIDATORS === //



    createRessources(form:any){
      this.ressources.requestCreateRessources(form)
      .then(res =>{
        console.log(res);
        this.ressources.requestDetailRessources(this.dashboard.currentProject.id)
        this.closeModal3()
        this.formAddRessources.reset()
        // Toaster a prevoir
      },err => {
        console.log(err);

      })
    }

    deleteResource(idRes){

      console.log('test id', idRes);
      

      this.ressources.requestDeleteRessource(this.dashboard.currentProject.id, idRes)
      .then(res =>{
        console.log('res' ,res);
        this.ressources.requestDetailRessources(this.dashboard.currentProject.id)
        this.dashboard.getAllProjects()
      },err => {
        console.log('err', err)
      })

    }

    updateResource(form:any, idRes){

      console.log('OOOOOOOOOO', form, idRes);
      
      console.log('test id', idRes);

      this.ressources.requestUpdateRessources(form, idRes)
      .then(res =>{
        console.log(res)
        this.ressources.requestDetailRessources(this.dashboard.currentProject.id)
        this.closeModalEditRess() 
      }, err => {
        console.log('up', err);
        
      })


    }

  public editRess
  onSelect(selectedItem: any) {
    console.log(selectedItem)
  this.editRess = selectedItem;


  this.nameCtrl2.setValue(this.editRess.name)
  this.jobCtrl2.setValue(this.editRess.job)
  this.ratioCtrl2.setValue(this.editRess.ratio)

      
    this.openModalEditRess()
  }



 
}
