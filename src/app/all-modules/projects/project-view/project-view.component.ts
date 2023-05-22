import { Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import {ProjectsService} from '../../projects.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {TasksService} from '../../tasks.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../login/user.service';
import {UsersService} from '../../users.service';
declare const $: any;
@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css'],
})
export class ProjectViewComponent implements OnInit {
  public projects = [];
  public tasksByProject = [];
  public activetasksByProject = [];
  public completedtasksByProject = [];
  public projectId: any;
  public taskid: any;
  public project: any;
  public projectTitle;
  public projectStart;
  public projectEnd;
  public projectDescription;
  public addTaskForm: FormGroup;
  public pipe = new DatePipe('en-US');
  public tempId: any;
  public tempId2: any;
  public usersList = [];
  public selectedUsers = [];
  public selectedManager = [];
  statusClass = 'not-selected-user';
  public activeMessage;
  public selectedUser ;
  public selected;
  disabled = false;
  ShowFilter = true;
  limitSelection = false;
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  dropdownSettingsManager: any = {};
  dropdownSettingsTask: any = {};
  public statusProject;
  public dateNow ;
  public selectedUserforTask = [];

  public foundUser;
  public foundManager: any;

  public foundUserName;
  public foundUserLastName;
  public foundUserEmail;

  public foundUsers = [];


  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private taskServiceService: TasksService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private userService:UsersService

  ) {}

  ngOnInit() {

    this.dateNow = new Date();
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 6,
      allowSearchFilter: this.ShowFilter,

    };

    this.dropdownSettingsManager = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter,

    };

    this.dropdownSettingsTask = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: this.ShowFilter,

    };
    this.getUsers();
    this.addTaskForm = this.formBuilder.group({
      taskName: ['', [Validators.required]],
      taskDeadline: ['', [Validators.required]],
      selectUser: ['', [Validators.required]]
    });
    this.route.params
      .pipe(
        map((_id) => {
          this.projectId = _id.id;
        }),
        mergeMap(() => this.projectsService.getAllProjects())
      )
      .subscribe((data) => {
        this.projects = data;
        this.project = this.projects.filter(
          (client) => client._id == this.projectId
        );
        this.projectTitle = this.project[0].project_name;
        this.projectStart = this.project[0].creation_date;
        this.statusProject = this.project[0].status;
        this.projectEnd = this.project[0].Deadline;
        this.projectDescription = this.project[0].description;

      });
    this.getTasksByProject();
    this.getActiveTasksByProject();
    this.getCompletedTasksByProject();
    this.getprojetManager(this.projectId)
    this.getprojetUsers(this.projectId);

  }

  addTask() {
    const TaskDeadline = this.pipe.transform(
      this.addTaskForm.value.taskDeadline,
      'yyyy-MM-dd'
    );

    const newTask = {
      name: this.addTaskForm.value.taskName,
      due_date: TaskDeadline,
      project:this.projectId,
      member:this.selectedUserforTask
    };
    this.taskServiceService.addTask(newTask).subscribe(response => {
    })
    this.addTaskForm.reset();
    $('#add_task').modal('hide');
    window.location.reload();
    this.toastr.success('Task added sucessfully...!', 'Success');
  }


  getTasksByProject() {
    this.taskServiceService.loadTasksByProject(this.projectId).subscribe((data) => {
      this.tasksByProject = data;
    });
  }
    getActiveTasksByProject() {
      this.taskServiceService.loadTasksByProject(this.projectId).subscribe((data) => {
        this.tasksByProject = data;
       this.activetasksByProject =  this.tasksByProject.filter(o => o.status === 'Active')

      });
    }
      getCompletedTasksByProject() {
        this.taskServiceService.loadTasksByProject(this.projectId).subscribe((data) => {
          this.tasksByProject = data;
        this.completedtasksByProject =  this.tasksByProject.filter(o => o.status === 'Completed')
        });
  }

  validateTask(id:any) {
    this.taskServiceService.validateTaks(id).subscribe((data) => {
      $('#confirm_task').modal('hide');
      this.getCompletedTasksByProject();
      window.location.reload();
      this.toastr.success('Task Validated sucessfully...!', 'Success');
    });
  }

  deletelfaza(id: any) {
    this.taskServiceService.deleteTask(id).subscribe((data) => {
      console.log("entered function")
      $('#delete_task').modal('hide');
      this.getCompletedTasksByProject();
      window.location.reload();
      this.toastr.warning('Task Has been Deleted...!', 'Warning');

    });
  }


  public getUsers() {

    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }

  setActiveClass(){
    this.statusClass = 'selected-user';
  }

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    this.selectedUsers.push(item._id)
    console.log(this.selectedUsers)
  }

  onItemSelectManager(item: any) {
    console.log('onItemSelect', item);
    this.selectedManager = [];
    this.selectedManager.push(item._id)
    console.log(this.selectedManager)
  }

  onItemSelectTask(item: any) {
    console.log('onItemSelect', item);
    this.selectedUserforTask = [];
    this.selectedUserforTask.push(item._id)
    console.log(this.selectedUserforTask)

  }


  // addUsertoProject(){
  //   const obj = {
  //     members: this.selectedUsers
  //   }
  //   console.log(this.selectedUsers)
  //   this.projectsService.addUserToProject(obj, this.projectId).subscribe(response => {
  //     console.log(response)
  //   })
  // }

  addManagertoProject(){
    const obj = {
      project_leader: this.selectedManager
    }
    this.projectsService.addManagerToProject(obj, this.projectId).subscribe(response => {
      console.log(response)
      $('#assignee').modal('hide');
      this.toastr.success("Manager Have Been Modified Successfully !","Success")
      window.location.reload();
    })
  }

  getUserfromTask(id){
    this.taskServiceService.getUserPerTask(id).subscribe(response => {
      this.foundUser = response
          })
  }

  getprojetManager(projectID){
    this.projectsService.getManagerByTraining(projectID).subscribe(data => {
      this.foundManager = data
      console.log(this.foundManager)
      console.log(this.projectId)
    })
  }

  addUserstoProject(){
    const obj = {
      member: this.selectedUsers
    }
    this.projectsService.addUserToProject(obj, this.projectId).subscribe(response => {
      console.log(response)
      $('#assign_user').modal('hide');
      this.toastr.success("Users Have been assigned successffully !","Success")
      window.location.reload();
    })
  }

  getprojetUsers(projectID){
    this.projectsService.getUsersByProject(projectID).subscribe(data => {
      this.foundUsers = data
      console.log(this.foundUsers)
    })
  }

}
