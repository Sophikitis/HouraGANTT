import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, SimpleChange, SimpleChanges, EventEmitter} from '@angular/core';
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";
import { FormControl, FormGroup, EmailValidator, Validators, FormBuilder} from '@angular/forms';


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

import { DashboardService } from '../../providers/dashboard.service';
import { RessourcesService } from '../../providers/ressources.service';


@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss'],
  providers: [TaskService, LinkService],

})
export class GanttComponent implements OnInit {

  value: any;
  @ViewChild('gantt_here') ganttContainer: ElementRef;


  public currentP : any = "";
  public oldView : any = "";
  public oldClick : boolean;
  public idProject : any = "";
  public deleteRess:boolean;
  public deletePro:boolean
  ResourceProject:any;



    // GOUP FORM
    formAddProject : FormGroup;
    formEditProject : FormGroup;
    formInvite     : FormGroup;

    // FORM CONTROLS
    // ADD
    nameCtrl          : FormControl;
    descriptionCtrl   : FormControl;
    duration_daysCtrl : FormControl;
    billingCtrl       : FormControl;
    linksCtrl         : FormControl;
    
    // EDIT
    nameCtrl2          : FormControl;
    descriptionCtrl2   : FormControl;
    duration_daysCtrl2 : FormControl;
    billingCtrl2       : FormControl;
    linksCtrl2         : FormControl;
    //
    emailCtrl         : FormControl;

    // DECLARATIONS
    public modalActions = new EventEmitter<string|MaterializeAction>();
    public modalActions2 = new EventEmitter<string|MaterializeAction>();
    public EditProject = new EventEmitter<string|MaterializeAction>();
    public confirmDeleteProject = new EventEmitter<string|MaterializeAction>();
    public modalAction4 = new EventEmitter<string|MaterializeAction>();

  constructor(
    public res : RessourcesService,
    private route: ActivatedRoute,
    private location: Location,
    private Routing: Router,
    private taskService: TaskService,
    private linkService: LinkService,
    public dashboard : DashboardService,
    public ressources : RessourcesService)
   {
     this.currentP = this.dashboard.currentProject;
     this.oldClick = true;
     this.deleteRess = true;
     this.deletePro = true;

     this.oldView = this.dashboard.viewCalendar
     console.log('okokok',this.currentP)
  }
 /* ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.route.params.subscribe(params => {
      this.value = params['id'];
    });
    console.log(this.value, 'rrr');
  }*/

  ngOnInit(){
    this.createFormControl()

    this.createFormAddProjects()
    this.createFormEditProject()

    this.createFormInvite()
  }

  ngDoCheck(){
    if(this.currentP != this.dashboard.currentProject 
      || this.oldClick != this.res.btnRessourcesClicked 
      || this.oldView != this.dashboard.viewCalendar
      || this.deleteRess != this.ressources.deletedRess 
      || this.deletePro != this.dashboard.deletedPro
    ){

      this.currentP = this.dashboard.currentProject
      this.oldClick = this.res.btnRessourcesClicked
      this.oldView = this.dashboard.viewCalendar
      this.deleteRess = this.ressources.deletedRess
      this.deletePro = this.dashboard.deletedPro
        //location.reload();

        this.value = this.currentP.id;
        this.idProject = this.currentP.id;

        // this.ressources.requestResourcesProject(this.dashboard.currentProject.id)

        this.ressources.requestDetailRessources(this.dashboard.currentProject.id)

        gantt.config.xml_date = '%Y-%m-%d %H:%i';
        gantt.form_blocks["my_editor"] = {
        render:function(sns) {
          return "<div class='dhx_cal_ltext' style='height:60px; display:none'>Text&nbsp;"
            +"<input type='text' id='resourceId' value='' name='resourceId'><br/>Holders&nbsp;<input type='text' id='resourceId' value='' name='resourceId'></div>";
        },
        set_value:function(node, value, task,section) {
          node.childNodes[1].value = value || "";
          node.childNodes[4].value = task.resource_id || "";
        },
        get_value:function(node, task,section) {
          task.resource_id = node.childNodes[4].value;
          return node.childNodes[1].value;
        },
        focus:function(node) {
          var a = node.childNodes[1];
          a.select();
          a.focus();
        }
      };

      gantt.templates.rightside_text = function(start, end, task){
      if(task.resources){
        return "<b>Resource: </b>" + task.resources.name;
      }
    };
      gantt.config.lightbox.sections = [
        {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
        {name:"additional_cost", height:38, map_to:"additional_cost", type:"textarea"},
        {name:"template", height:16, type:"template", map_to:"testSelect"},
        {name:"time", type:"duration", map_to: "auto"},
        {name:"resource_id", height:200, map_to:"resource_id", type:"my_editor"},
      ];

      gantt.locale.labels.section_template = "Resource";
      gantt.locale.labels.section_additional_cost = "additional_cost";

      gantt.attachEvent("onBeforeLightbox", (id) => {
        // TODO : FAIRE UNE BOUCLE
        this.ResourceProject = this.ressources.projectRessourceDetail;
        var task = gantt.getTask(id);
        var resourceId = task.resource_id;
        var test ="<select id='CurrentResource' name='CurrentResource' class=\"browser-default\">";
        if(!resourceId || resourceId === null){
          test+="<option value='0' selected>choose resource</option>";
        }else{
          test+="<option value='0'>choose resource</option>";
        }
        for(var i =0; i < this.ResourceProject.length; i++) {
          if(resourceId && resourceId != null && resourceId == this.ResourceProject[i].id){
            test+= '<option value="'+this.ResourceProject[i].id+'" selected>' + this.ResourceProject[i].name + '</option>';
            console.log(resourceId,'selected',this.ResourceProject[i].id)

          }else{
            test+= '<option value="'+this.ResourceProject[i].id+'">' + this.ResourceProject[i].name + '</option>';
            console.log(resourceId,'not selected',this.ResourceProject[i].id)
          }
        }
        test+=' </select>';
        task.testSelect = test;
        return true;
    });

        //gantt.config.columns =  [];
        var resourcesStore = gantt.createDatastore({
          name: gantt.config.resource_store
        });


        gantt.config.fit_tasks = true;
        /* function at enable to change the view */


        this._initOnce();
        /* change view initialize */
        this.setScaleConfig(this.dashboard.viewCalendar);

        /* gantt initialize*/

        gantt.init(this.ganttContainer.nativeElement);
        /** load gantt data using a promise **/
        Promise.all([this.taskService.get(this.value), this.linkService.get()])
          .then(([gant, links]) => {
            const data = gant.data.tasks;
            this.ResourceProject = gant.data.resources;
            console.log('!!!!', gant.data)
            console.log('!PO!', this.ResourceProject)

            console.log(data)
            gantt.parse({data, links});
          });
        resourcesStore.parse([
          {id: 1, text: "John"},
          {id: 2, text: "Mike"},
          {id: 3, text: "Anna"},
          {id: 4, text: "Bill"}
        ]);

        gantt.clearAll();

    }
  }


  _initOnce() {


    if (gantt._$initialized) {
      return;
    }
    gantt._$initialized = true;
    gantt.attachEvent('onAfterTaskAdd', (id, item) => {

      console.log(this.serializeTask(item, true));


      this.taskService.insert(this.serializeTask(item, true), this.dashboard.currentProject.id)
        .then((response) => {
          if (response.data.id !== id) {
            console.log("!!!!", response)
            gantt.changeTaskId(id, response.data.id);
            this.dashboard.getAllProjects();
          }
        });
    });

    gantt.attachEvent('onAfterTaskUpdate', (id, item) => {
      this.taskService.update(this.serializeTask(item), id, this.dashboard.currentProject.id);
      console.log(this.ResourceProject);
      var name = "";
      var obj;
      for(var y = 0; y < this.ResourceProject.length; y++) {
          if(this.ResourceProject[y].id == item.resource_id){
              name = this.ResourceProject[y].name;
              obj= this.ResourceProject[y];
          }
      }
      if(name == ""){
        item.resources = null;
      }else{
        item.resources = obj;
      }
      gantt.refreshData();
      gantt.render();
    });
    gantt.attachEvent("onBeforeLightbox", function(id) {
      var task = gantt.getTask(id);
      task.my_template = "<span id='title1'>Holders: </span>"+ task.users
        +"<span id='title2'>Progress: </span>"+ task.progress*100 +" %";
      return true;
    });

    gantt.attachEvent('onAfterTaskDelete', (id) => {
      this.taskService.remove(id, this.dashboard.currentProject.id);
    });

    gantt.attachEvent('onAfterLinkAdd', (id, item) => {
      this.linkService.insert(this.serializeLink(item, true))
        .then((response) => {
          if (response.id !== id) {
            gantt.changeLinkId(id, response.tid);
          }
        });
    });

    gantt.attachEvent('onAfterLinkUpdate', (id, item) => {
      this.linkService.update(this.serializeLink(item));
    });

    gantt.attachEvent('onAfterLinkDelete', (id) => {
      this.linkService.remove(id);
    });

    gantt.attachEvent('onTaskClick', (id) => {
      console.log(id);
    });
  }

  onExportClick() {
    gantt.exportToMSProject();
  }




  // ngOnInit() {


  //   this.route.params.subscribe(params => {
  //     //location.reload();


  //     this.value = params['id'];


  //     gantt.config.xml_date = '%Y-%m-%d %H:%i';
  //     gantt.serverList("people", [
  //       {key: 1, label: "John"},
  //       {key: 2, label: "Mike"},
  //       {key: 3, label: "Anna"},
  //       {key: 4, label: "Bill"},
  //       {key: 7, label: "Floe"}
  //     ]);

  //     gantt.locale.labels.section_owner = "Ressources";

  //     gantt.config.lightbox.sections = [
  //       {name:"description", height:38, map_to:"text", type:"textarea", focus:true},
  //       {name:"owner", map_to:"owner_id", type:"select", options:gantt.serverList("people")},
  //       {name:"time", type:"duration", map_to: "auto"}
  //     ];
  //     //gantt.config.columns =  [];
  //     var resourcesStore = gantt.createDatastore({
  //       name: gantt.config.resource_store
  //     });



  //     /* function at enable to change the view */

  //     function setScaleConfig(level) {
  //       switch (level) {
  //         case "day":
  //           gantt.config.scale_unit = "day";
  //           gantt.config.step = 1;
  //           gantt.config.date_scale = "%d %M";
  //           gantt.templates.date_scale = null;

  //           gantt.config.scale_height = 27;

  //           gantt.config.subscales = [];
  //           break;
  //         case "week":
  //           var weekScaleTemplate = function (date) {
  //             var dateToStr = gantt.date.date_to_str("%d %M");
  //             var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
  //             return dateToStr(date) + " - " + dateToStr(endDate);
  //           };

  //           gantt.config.scale_unit = "week";
  //           gantt.config.step = 1;
  //           gantt.templates.date_scale = weekScaleTemplate;

  //           gantt.config.scale_height = 50;

  //           gantt.config.subscales = [
  //             {unit: "day", step: 1, date: "%D"}
  //           ];
  //           break;
  //         case "month":
  //           gantt.config.scale_unit = "month";
  //           gantt.config.date_scale = "%F, %Y";
  //           gantt.templates.date_scale = null;

  //           gantt.config.scale_height = 50;

  //           gantt.config.subscales = [
  //             {unit: "day", step: 1, date: "%j, %D"}
  //           ];

  //           break;
  //         case "year":
  //           gantt.config.scale_unit = "year";
  //           gantt.config.step = 1;
  //           gantt.config.date_scale = "%Y";
  //           gantt.templates.date_scale = null;

  //           gantt.config.min_column_width = 50;
  //           gantt.config.scale_height = 90;

  //           gantt.config.subscales = [
  //             {unit: "month", step: 1, date: "%M"}
  //           ];
  //           break;
  //       }
  //     }
  //     this._initOnce();
  //     /* change view initialize */
  //     setScaleConfig('week');

  //     /* gantt initialize*/
  //     gantt.init(this.ganttContainer.nativeElement);
  //     /** load gantt data using a promise **/
  //     Promise.all([this.taskService.get(this.value), this.linkService.get()])
  //       .then(([gant, links]) => {
  //         const data = gant.data.tasks;
  //         console.log(data)
  //         gantt.parse({data, links});
  //       });
  //     resourcesStore.parse([
  //       {id: 1, text: "John"},
  //       {id: 2, text: "Mike"},
  //       {id: 3, text: "Anna"},
  //       {id: 4, text: "Bill"}
  //     ]);

  //   });


  // }

  private serializeTask(data: any, insert: boolean = false): Task {
    return this.serializeItem(data, insert) as Task;
  }

  private serializeLink(data: any, insert: boolean = false): Link {
    return this.serializeItem(data, insert) as Link;
  }

  private serializeItem(data: any, insert: boolean): any {
    const result = {};
    for (const i in data) {
      if (i.charAt(0) === '$' || i.charAt(0) === '_') continue;
      if (insert && i === 'id') continue;
      if (data[i] instanceof Date) {
        result[i] = gantt.templates.xml_format(data[i]);
      } else {
        result[i] = data[i];
      }
    }
    return result;
  }

   setScaleConfig(level) {
    switch (level) {
      case "day":
        gantt.config.scale_unit = "day";
        gantt.config.step = 1;
        gantt.config.date_scale = "%d %M";
        gantt.templates.date_scale = null;

        gantt.config.scale_height = 27;

        gantt.config.subscales = [];
        break;
      case "week":
        var weekScaleTemplate = function (date) {
          var dateToStr = gantt.date.date_to_str("%d %M");
          var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
          return dateToStr(date) + " - " + dateToStr(endDate);
        };

        gantt.config.scale_unit = "week";
        gantt.config.step = 1;
        gantt.templates.date_scale = weekScaleTemplate;

        gantt.config.scale_height = 50;

        gantt.config.subscales = [
          {unit: "day", step: 1, date: "%D"}
        ];
        break;
      case "month":
        gantt.config.scale_unit = "month";
        gantt.config.date_scale = "%F, %Y";
        gantt.templates.date_scale = null;

        gantt.config.scale_height = 50;

        gantt.config.subscales = [
          {unit: "day", step: 1, date: "%j, %D"}
        ];

        break;
      case "year":
        gantt.config.scale_unit = "year";
        gantt.config.step = 1;
        gantt.config.date_scale = "%Y";
        gantt.templates.date_scale = null;

        gantt.config.min_column_width = 50;
        gantt.config.scale_height = 90;

        gantt.config.subscales = [
          {unit: "month", step: 1, date: "%M"}
        ];
        break;
    }
  }

//   ngOnDestroy() {

//  }



  // === CREATION FORMULAIRE ET VALIDATORS === //
  createFormControl(){
    this.nameCtrl = new FormControl('', [
      Validators.required
    ]);

    this.emailCtrl = new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
    ]);

    this.descriptionCtrl = new FormControl()

    this.duration_daysCtrl = new FormControl('', [
      Validators.required
    ]);

    this.billingCtrl = new FormControl('', [
      Validators.required
    ]);
    this.linksCtrl = new FormControl('')
  

    this.nameCtrl2 = new FormControl('', [
      Validators.required
    ]);

    this.descriptionCtrl2 = new FormControl()

    this.duration_daysCtrl2 = new FormControl('', [
      Validators.required
    ]);

    this.billingCtrl2 = new FormControl('', [
      Validators.required
    ]);
    this.linksCtrl2 = new FormControl('')

  
}
  createFormAddProjects() {
    this.formAddProject = new FormGroup({
      nameCtrl: this.nameCtrl,
      descriptionCtrl: this.descriptionCtrl,
      duration_daysCtrl: this.duration_daysCtrl,
      linksCtrl: this.linksCtrl
    });
  }

  createFormEditProject() {
    this.formEditProject = new FormGroup({
      nameCtrl2: this.nameCtrl2,
      descriptionCtrl2: this.descriptionCtrl2,
      duration_daysCtrl2: this.duration_daysCtrl2,
      linksCtrl2: this.linksCtrl2

    })
  }
  createFormInvite() {
    this.formInvite = new FormGroup({
      emailCtrl: this.emailCtrl,
    });
  }
  // === FIN CREATION FORMULAIRE ET VALIDATORS === //



  // TODO :  RENOMMER FONCTIONS
  // MODAL INFOS
  openModal2() {
    this.modalActions2.emit({action:"modal",params:['open']});
  }
  closeModal2() {
    this.modalActions2.emit({action:"modal",params:['close']});
  }
  // MODAL CREATION PROJET
  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }
  //Modal Invite
  openModal4() {
    this.modalAction4.emit({action:"modal",params:['open']});
  }
  closeModal4() {
    this.modalAction4.emit({action:"modal",params:['close']});
  }


  openModalEditProject() {
    this.EditProject.emit({action:"modal",params:['open']});
  }
  closeModalEditProject() {
    this.EditProject.emit({action:"modal",params:['close']});
  }

  openModaDeleteProject() {
    this.confirmDeleteProject.emit({action:"modal",params:['open']});
  }
  closeModalDeleteProject() {
    this.confirmDeleteProject.emit({action:"modal",params:['close']});
  }

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
// delete

deleteProject(){
  let selectedProjectId = this.dashboard.currentProject.id
  this.dashboard.requestDeleteProject(selectedProjectId).then( res =>{
    this.closeModalDeleteProject();
    this.dashboard.getAllProjects()
    this.dashboard.selectedProject = false;
    

  }, err => {
      console.log('delete erreur', err );
      
  })

}



//  EDIIIIIT
    public editProject
    onSelectEditProject(selectedItem: any) {
      console.log(selectedItem)
    this.editProject = selectedItem;
  
  
    this.nameCtrl2.setValue(this.editProject.name)
    this.descriptionCtrl2.setValue(this.editProject.description)
    this.duration_daysCtrl2.setValue(this.editProject.duration_days)
    this.linksCtrl2.setValue("http://")
        
    this.openModalEditProject()
    }


    updateProject(form:any){

    this.dashboard.requestEditProject(form)
    .then(res =>{
      console.log("updateProject res", res);
      this.formEditProject.reset()
      this.dashboard.getAllProjects()
      this.closeModalEditProject()
    }, err => {
      console.log("updateProject err", err);
      
    })


        
    }

    invite(form) {
      this.dashboard.requestInvite(form).then(res => {
        if(res) {
          this.formInvite.reset()
          this.closeModal4()
        }
      })
    }

  }
