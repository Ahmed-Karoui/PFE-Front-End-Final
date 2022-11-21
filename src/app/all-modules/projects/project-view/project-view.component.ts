import { Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import {ProjectsService} from '../../projects.service';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css'],
})
export class ProjectViewComponent implements OnInit {
  public projects = [];
  public projectId: any;
  public project: any;
  public projectTitle;
  public projectStart;
  public projectEnd;
  public projectDescription;


  constructor(
    private allModulesService: AllModulesService,
    private route: ActivatedRoute,
    private projectsService: ProjectsService

  ) {}

  ngOnInit() {
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
  }
}
