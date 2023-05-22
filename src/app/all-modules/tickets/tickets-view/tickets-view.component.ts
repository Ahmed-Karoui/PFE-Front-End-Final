import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {map, mergeMap} from 'rxjs/operators';
import {AllModulesService} from '../../all-modules.service';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService} from '../../projects.service';
import {TasksService} from '../../tasks.service';
import {ToastrService} from 'ngx-toastr';
import {TicketsService} from '../../tickets.service';
import {TokenStorageService} from '../../../login/token-storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';


declare const $: any;
@Component({
  selector: 'app-tickets-view',
  templateUrl: './tickets-view.component.html',
  styleUrls: ['./tickets-view.component.css']
})
export class TicketsViewComponent implements OnInit {

  public taskId: any;
  public tasks = [];
  public task: any;
  public taskDescription ;
  public taskCategory ;
  public taskUrgency ;
  public taskDepartement ;
  public taskCreationDate ;
  public estiamteDate ;
  public taskStatus ;
  public taskContent ;
  public taskpriority;
  public userInfos
  public currentUser;

  public associatedFile;
  fileUrl;





  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private taskServiceService: TasksService,
    private ticketService: TicketsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private StorageService:TokenStorageService,
    private sanitizer: DomSanitizer,
    private http:HttpClient


  ) { }

  ngOnInit() {
    $(document).ready(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
    this.currentUser = this.StorageService.getUser();
    this.route.params
      .pipe(
        map((_id) => {
          this.taskId = _id.id;
        }),
        mergeMap(() => this.ticketService.getAllTickets())
      )
      .subscribe((data) => {
        this.tasks = data;
        this.task = this.tasks.filter(
          (client) => client._id == this.taskId
        );
        this.taskDescription = this.task[0].description;
        this.taskCategory = this.task[0].category;
        this.taskUrgency = this.task[0].urgency;
        this.taskDepartement = this.task[0].departement;
      this.taskCreationDate =  this.task[0].creation_date;
        this.estiamteDate = this.task[0].estiamte_date;
        this.taskStatus = this.task[0].status;
        this.taskContent = this.task[0].content ;
        this.taskpriority = this.task[0].priority;
        this.associatedFile = this.task[0].sampleFile;

      });
  this.getUserInfos();
  }

  resolveTicket(){
    const validatedTicket = {
      description: this.task[0].description,
      category: this.task[0].category,
      urgency: this.task[0].urgency,
      departement: this.task[0].departement,
      creation_date: this.task[0].creation_date,
      content: this.task[0].content,
      status: 'Solved',
      usermail:this.userInfos.email,
    }

      this.ticketService.validateTicket(validatedTicket, this.task[0]._id).subscribe(response => {
        console.log(response);
      })
    //this.getProjects();
    $('#validate_ticket').modal('hide');
    this.toastr.success('Ticket Has Been Validated sucessfully...!', 'Success');
    }

  getUserInfos() {
    this.ticketService.getUserInfo(this.taskId).subscribe((data) => {
      this.userInfos = data;
      console.log(this.userInfos)
    });
  }

  downloadfile(id) {
    let datafound ;
    this.http.get('assets/'+id)
      .subscribe(data => datafound = data);
    const blob = new Blob([datafound], {
      type: 'application/octet-stream'
    });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

  }
