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
  public usersList = [];
  statusClass = 'not-selected-user';
  public activeMessage;
  public selectedUser ;


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
    this.getUsers();
    this.addTaskForm = this.formBuilder.group({
      taskName: ['', [Validators.required]],
      taskDeadline: ['', [Validators.required]]
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
        this.projectStart = this.project[0].description;
        this.projectEnd = this.project[0].endDate;
        this.projectDescription = this.project[0].description;

      });
    this.getTasksByProject();
    this.getActiveTasksByProject();
    this.getCompletedTasksByProject();
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
    };
    this.taskServiceService.addTask(newTask).subscribe(response => {
    })
    this.addTaskForm.reset();
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
    });
  }

  deleteTask(tempId: any) {
  }


  public getUsers() {

    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }

  setActiveClass(){
    this.statusClass = 'selected-user';
  }

  addUsertoProject(user){
    //this.selectedUser = user;
    let selectedUser = {
      members: user
    }
    console.log(this.selectedUser)
    this.projectsService.addUserToProject(selectedUser, this.projectId).subscribe(response => {
      console.log(response)
    })
  }
}
