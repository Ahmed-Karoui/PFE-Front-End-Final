import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {TokenStorageService} from '../../../../login/token-storage.service';
import {Router} from '@angular/router';
import {ProjectsService} from '../../../projects.service';
import {Subject} from 'rxjs';
import {TrainingsService} from '../../../trainings.service';

@Component({
  selector: "app-employee-profile",
  templateUrl: "./employee-profile.component.html",
  styleUrls: ["./employee-profile.component.css"],
})
export class EmployeeProfileComponent implements OnInit {
  public addEmployeeForm: FormGroup;
  currentuser:any;
  isLoggedIn = false;
  public projects = [];
  public trainings = [];
  public rows = [];
  public srch = [];
  public dtTrigger: Subject<any> = new Subject();


  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private tokenStorage: TokenStorageService,
    private router:Router,
    private projectsService: ProjectsService,
    private trainingsService:TrainingsService


  ) {}

  ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      client: ["", [Validators.required]],
    });
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
  }

  onSubmit() {
    this.toastr.success("Bank & statutory added", "Success");
  }

  getProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.projects = data;
      this.dtTrigger.next();
      this.rows = this.projects;
      this.srch = [...this.rows];
      this.projects = (this.rows.filter(x => x.members.includes(this.currentuser.id)));
      console.log(this.projects)

    });
  }


  getTrainings() {
    this.trainingsService.getAlltrainings().subscribe((data) => {
      this.trainings = data;
      this.trainings = (this.trainings.filter(x => x.users.includes(this.currentuser.id)));
      console.log(this.trainings)

    });
  }
}
