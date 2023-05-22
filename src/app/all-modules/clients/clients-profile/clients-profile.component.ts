import { Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import {ActivatedRoute, Router} from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import {UsersService} from '../../users.service';
import {ProjectsService} from '../../projects.service';
import {TrainingsService} from '../../trainings.service';
import {TokenStorageService} from '../../../login/token-storage.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-clients-profile',
  templateUrl: './clients-profile.component.html',
  styleUrls: ['./clients-profile.component.css']
})
export class ClientsProfileComponent implements OnInit {
  public allClients = [];

  currentuser:any;
  isLoggedIn = false;

  public client = [];
  public clientId;

  public projects = [];
  public trainings = [];
  public rows = [];
  public srch = [];
  public dtTrigger: Subject<any> = new Subject();


  constructor(private allModulesService: AllModulesService,
              private route: ActivatedRoute,
              private userService:UsersService,
              private projectsService: ProjectsService,
              private trainingsService:TrainingsService,
              private tokenStorage: TokenStorageService,
              private router:Router

  ) { }



  ngOnInit() {
    this.route.params.pipe(map(_id => {
      this.clientId = _id.id;
    }), mergeMap(() => this.userService.getAllUsers())).subscribe(data => {
      this.allClients = data;
      this.client = this.allClients.filter(client => client._id == this.clientId);
      console.log((this.client));
      this.currentuser = this.tokenStorage.getUser();
      this.isLoggedIn = !!this.tokenStorage.getToken();
      console.log(this.currentuser)

      if (this.isLoggedIn) {
        const user = this.tokenStorage.getUser();
      }
      else {
        this.router.navigate(['/login']);
      }
      this.getProjects();
      this.getTrainings();
    });
  }

  getProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.projects = data;
      this.dtTrigger.next();
      this.rows = this.projects;
      this.srch = [...this.rows];
      this.projects = (this.rows.filter(x => x.members.includes(this.clientId)));
      console.log(this.projects)

    });
  }


  getTrainings() {
    this.trainingsService.getAlltrainings().subscribe((data) => {
      this.trainings = data;
      this.trainings = (this.trainings.filter(x => x.users.includes(this.clientId)));
      console.log(this.trainings)

    });
  }

}
