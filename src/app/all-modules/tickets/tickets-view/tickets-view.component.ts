import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {map, mergeMap} from 'rxjs/operators';
import {AllModulesService} from '../../all-modules.service';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService} from '../../projects.service';
import {TasksService} from '../../tasks.service';
import {ToastrService} from 'ngx-toastr';
import {TicketsService} from '../../tickets.service';

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





  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private taskServiceService: TasksService,
    private ticketService: TicketsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit() {
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

      });
  }
}
