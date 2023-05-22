import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import {ProjectsService} from '../../projects.service';
import {TokenStorageService} from '../../../login/token-storage.service';

declare const $: any;
@Component({
  selector: 'app-project-content',
  templateUrl: './project-content.component.html',
  styleUrls: ['./project-content.component.css'],
})
export class ProjectContentComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public projects = [];
  public addProjectForm: FormGroup;
  public editProjectForm: FormGroup;
  public tempId: any;
  public result;

  public projectCategory;
 public deadline;
 public editedProject;
  public rows = [];
  public srch = [];
  public statusValue;
  public currentuser;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');
  constructor(
    private allModulesService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private projectsService: ProjectsService,
    private tokenStorage: TokenStorageService,

  ) {}

  ngOnInit() {
    $(document).ready(function () {
      $('[data-bs-toggle="tooltip"]').tooltip();
    });
    this.currentuser = this.tokenStorage.getUser();
    this.getProjects();
    // Add Projects form
    this.addProjectForm = this.formBuilder.group({
      projectName: ['', [Validators.required]],
      projectDescription: ['', [Validators.required]],
      projectStartDate: ['', [Validators.required]],
      projectEndDate: ['', [Validators.required]],
      projectCategory: ['', [Validators.required]],
    });

    // Edit Projects Form
    this.editProjectForm = this.formBuilder.group({
        editProjectName: ['', [Validators.required]],
        editProjectDescription: ['', [Validators.required]],
        editProjectEndDate: [''],
        editProjectStatus: ['', [Validators.required]],
      editProjectCategory: ['', [Validators.required]]
      });

  }

  getProjects() {
    this.projectsService.getAllProjects().subscribe((data) => {
      this.projects = data;
      this.dtTrigger.next();
      this.rows = this.projects;
      this.srch = [...this.rows];
      //this.projects = (this.rows.filter(x => x.members.includes(this.currentuser.id)));
      console.log(this.projects)

    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  // Create New Project
  public addProject() {
    if(this.addProjectForm.invalid){
      this.markFormGroupTouched(this.addProjectForm)
      return
    }
    const StartDate = this.pipe.transform(
      this.addProjectForm.value.projectStartDate,
      'yyyy-MM-dd'
    );
    const EndDate = this.pipe.transform(
      this.addProjectForm.value.projectEndDate,
      'yyyy-MM-dd'
    );
    const newProject = {
      project_name: this.addProjectForm.value.projectName,
      description: this.addProjectForm.value.projectDescription,
      Deadline: EndDate,
      category: this.addProjectForm.value.projectCategory,
    };
    this.projectsService.addProject(newProject).subscribe(response => {
      console.log(response)
    })
    this.getProjects();
    this.addProjectForm.reset();
    $('#create_project').modal('hide');
    this.getProjects();
    this.toastr.success('Project added sucessfully...!', 'Success');
  }

  // Edit project
  editProject(id: any) {
    this.tempId = id;
    const project = this.projects.filter((client) => client._id === id);
    console.log(project);
    this.projectCategory = project[0].category;
    this.deadline = project[0].Deadline;
    this.editProjectForm.setValue({
      editProjectName: project[0].project_name,
      editProjectDescription: project[0].description,
      editProjectEndDate: project[0].Deadline,
      editProjectStatus: project[0].status,
      editProjectCategory: project[0].category
    });

    this.editedProject = {
      editId: project[0]._id,
    };
  }

  // Save Project
  public saveProject(id: any) {
    const StartDate = this.pipe.transform(
      this.editProjectForm.value.projectStartDate,
      'yyyy-MM-dd'
    );
    const EndDate = this.pipe.transform(
      this.editProjectForm.value.projectEndDate,
      'yyyy-MM-dd'
    );
    const editedProject = {
      project_name: this.editProjectForm.value.editProjectName,
      description: this.editProjectForm.value.editProjectDescription,
      Deadline: this.editProjectForm.value.projectEndDate,
      category: this.editProjectForm.value.editProjectCategory,
      status:this.editProjectForm.value.editProjectStatus,
    };
    this.projectsService.updateProject(editedProject, id).subscribe(response => {
      console.log(response)
    })
    this.editProjectForm.reset();
    $('#edit_project').modal('hide');
    this.getProjects();
    this.toastr.success('Project updated sucessfully...!', 'Success');
  }

  // Delete project
  public deleteProject(id: any) {
      this.projectsService.deleteData(id).subscribe(res => {
        this.projects = this.projects.filter(item => item.id !== id);
      })
    this.getProjects();
    $('#delete_project').modal('hide');
    this.toastr.success('Project deleted sucessfully...!', 'Success');
  }

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.project_name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by name
  searchByEmpname(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by purchase
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // for unsubscribe datatable
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
