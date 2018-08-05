import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, SimpleChange, SimpleChanges, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {TaskService} from '../../services/task.service';
import {LinkService} from '../../services/link.service';
import {Task} from '../../models/task';
import {Link} from '../../models/link';
declare let gantt: any;
import { Location } from '@angular/common';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";


import { DashboardService } from '../../providers/dashboard.service';
import { GanttComponent } from '../gantt/gantt.component';
import { RessourcesService } from '../../providers/ressources.service';

import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';




const { ipcRenderer } = require('electron')



@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [TaskService, LinkService],
})
export class DashboardComponent implements OnInit {
  public modalActions = new EventEmitter<string|MaterializeAction>();

    // GOUP FORM
    formAddProject : FormGroup;

    // FORM CONTROLS
    nameCtrl          : FormControl;
    descriptionCtrl   : FormControl;
    duration_daysCtrl : FormControl;
    billingCtrl       : FormControl;
    linksCtrl         : FormControl;

  constructor(
    public dashboard : DashboardService,
    public ressources : RessourcesService
  ){
    ipcRenderer.send('resize-app')
  }


  ngOnInit(){
    this.createFormControl()
    this.createFormAddProjects()
  }

  // MODAL CREATION PROJET
  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }


  // === CREATION FORMULAIRE ET VALIDATORS === //
  createFormControl(){
    this.nameCtrl = new FormControl('', [
      Validators.required
    ]);

    this.descriptionCtrl = new FormControl()

    this.duration_daysCtrl = new FormControl('', [
      Validators.required
    ]);

    this.billingCtrl = new FormControl('', [
      Validators.required
    ]);
    this.linksCtrl = new FormControl('')
  }
  createFormAddProjects() {
    this.formAddProject = new FormGroup({
      nameCtrl: this.nameCtrl,
      descriptionCtrl: this.descriptionCtrl,
      duration_daysCtrl: this.duration_daysCtrl,
      linksCtrl: this.linksCtrl
    });
  }
  // === FIN CREATION FORMULAIRE ET VALIDATORS === //

     // TODO : JS DOC
    createProject(form){

      this.dashboard.requestCreateProject(form).then(res => {
        if(res){
          this.formAddProject.reset()
          this.dashboard.getAllProjects()
          this.closeModal()
        }
      })
    }

}

