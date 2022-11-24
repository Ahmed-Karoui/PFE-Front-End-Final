import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {map, mergeMap} from 'rxjs/operators';
import {AllModulesService} from '../../../all-modules.service';
import {ActivatedRoute} from '@angular/router';
import {ProjectsService} from '../../../projects.service';
import {TasksService} from '../../../tasks.service';
import {ToastrService} from 'ngx-toastr';
import {TrainingsService} from '../../../trainings.service';

@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.css']
})
export class InvoiceViewComponent implements OnInit {
  public TrainingId: any;
  public Training = [];
  public training: any;
  public trainingName;
  public trainingDescription;
  public trainingCategory;
  public traininDate;
  public users = [];
  public usersByTraining = [];


  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private taskServiceService: TasksService,
    private trainingService: TrainingsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map((_id) => {
          this.TrainingId = _id.id;
        }),
        mergeMap(() => this.trainingService.getAlltrainings())
      )
      .subscribe((data) => {
        this.Training = data;
        this.training = this.Training.filter(
          (client) => client._id == this.TrainingId
        );
        this.trainingName = this.training[0].name;
        this.trainingDescription = this.training[0].description;
        this.trainingCategory = this.training[0].category;
        this.traininDate = this.training[0].training_date;
        this.users = this.training[0].users;
        console.log(this.users);
        this.getTrainingByUser();

      });
  }


  getTrainingByUser() {
    this.trainingService.getUsersByTraining(this.TrainingId).subscribe((data) => {
      this.usersByTraining = data;
      console.log(this.usersByTraining)
    });
  }
}
