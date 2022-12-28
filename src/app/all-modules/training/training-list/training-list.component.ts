import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import {TrainingsService} from '../../trainings.service';
import {UsersService} from '../../users.service';

declare const $: any;
@Component({
  selector: 'app-training-list',
  templateUrl: './training-list.component.html',
  styleUrls: ['./training-list.component.css'],
})
export class TrainingListComponent implements OnInit {
  public lstEmployee: any[];
  public url: any = 'employeelist';
  public tempId: any;
  public editId: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;
  public usersList ;

  public pipe = new DatePipe('en-US');
  public rows = [];
  public srch = [];
  public statusValue;
  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private trainingService:TrainingsService,
    private userService:UsersService
  ) {}

  ngOnInit() {
    this.loadEmployee();
    this.addEmployeeForm = this.formBuilder.group({
      trainingName: ['', [Validators.required]],
      trainingDescription: ['', [Validators.required]],
      trainingStatus: ['', [Validators.required]],
      Deadline: ['', [Validators.required]],
      trainingCategory: ['', [Validators.required]],
      trainingLink: ['', [Validators.required]],
      trainingResponsible: ['', [Validators.required]],
      trainingType: ['', [Validators.required]],
    });

    this.editEmployeeForm = this.formBuilder.group({
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      UserName: ['', [Validators.required]],
      Password: ['', [Validators.required]],
      ConfirmPassword: ['', [Validators.required]],
      DepartmentName: ['', [Validators.required]],
      Designation: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      PhoneNumber: ['', [Validators.required]],
      JoinDate: ['', [Validators.required]],
      CompanyName: ['', [Validators.required]],
      EmployeeID: ['', [Validators.required]],
    });
  }

  // Get Employee  Api Call
  loadEmployee() {
    this.trainingService.getAlltrainings().subscribe((data) => {
      this.lstEmployee = data;
      this.rows = this.lstEmployee;
      this.srch = [...this.rows];
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

  // Add employee  Modal Api Call
  addEmployee() {
    if(this.addEmployeeForm.invalid){
      this.markFormGroupTouched(this.addEmployeeForm)
      return
    }
    const DateJoin = this.pipe.transform(
      this.addEmployeeForm.value.JoinDate,
      'dd-MM-yyyy'
    );
    const obj = {
      name: this.addEmployeeForm.value.trainingName,
      description: this.addEmployeeForm.value.trainingDescription,
      status: this.addEmployeeForm.value.trainingStatus,
      category: this.addEmployeeForm.value.trainingCategory,
      training_date: this.addEmployeeForm.value.Deadline,
      training_link:this.addEmployeeForm.value.trainingLink,
      training_responsible:this.addEmployeeForm.value.trainingResponsible,
      training_type:this.addEmployeeForm.value.trainingType
    };
    this.trainingService.addTraining(obj).subscribe((data) => {});
    this.loadEmployee();
    $('#add_employee').modal('hide');
    this.addEmployeeForm.reset();
    this.toastr.success('Training has added successfully...!', 'Success');
  }

  editEmployee() {
    const DateJoin = this.pipe.transform(
      this.editEmployeeForm.value.JoinDate,
      'dd-MM-yyyy'
    );
    const obj = {
      firstname: this.editEmployeeForm.value.FirstName,
      lastname: this.editEmployeeForm.value.LastName,
      username: this.editEmployeeForm.value.UserName,
      email: this.editEmployeeForm.value.Email,
      password: this.editEmployeeForm.value.Password,
      confirmpassword: this.editEmployeeForm.value.ConfirmPassword,
      employeeId: this.editEmployeeForm.value.EmployeeID,
      joindate: DateJoin,
      phone: this.editEmployeeForm.value.PhoneNumber,
      company: this.editEmployeeForm.value.CompanyName,
      department: this.editEmployeeForm.value.DepartmentName,
      designation: this.editEmployeeForm.value.Designation,
      mobile: '9944996335',
      role: 'Web developer',
      id: this.editId,
    };
    this.srvModuleService.update(obj, this.url).subscribe((data1) => {});
    this.loadEmployee();
    $('#edit_employee').modal('hide');
    this.toastr.success('Employeee Updated sucessfully...!', 'Success');
  }

  // To Get The employee Edit Id And Set Values To Edit Modal Form
  editEmp(value) {
    this.editId = value;
    const index = this.lstEmployee.findIndex((item) => {
      return item.id === value;
    });
    const toSetValues = this.lstEmployee[index];
    this.editEmployeeForm.setValue({
      FirstName: toSetValues.firstname,
      LastName: toSetValues.lastname,
      UserName: toSetValues.username,
      Email: toSetValues.email,
      Password: toSetValues.password,
      ConfirmPassword: toSetValues.confirmpassword,
      EmployeeID: toSetValues.employeeId,
      JoinDate: toSetValues.joindate,
      PhoneNumber: toSetValues.phone,
      CompanyName: toSetValues.company,
      DepartmentName: toSetValues.department,
      Designation: toSetValues.designation,
    });
  }

  // edit update data set
  public edit(value: any) {
    const data = this.lstEmployee.filter((client) => client.id === value);
    this.editEmployeeForm.setValue({
      FirstName: data[0].firstname,
      LastName: data[0].lastname,
      UserName: data[0].username,
      Email: data[0].email,
      Password: data[0].password,
      ConfirmPassword: data[0].confirmpassword,
      EmployeeID: data[0].employeeId,
      JoinDate: data[0].joindate,
      PhoneNumber: data[0].phone,
      CompanyName: data[0].company,
      DepartmentName: data[0].department,
      Designation: data[0].designation,
      Id: data[0].id,
    });
  }

  // delete api call
  deleteEmployee() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
      this.loadEmployee();
      $('#delete_employee').modal('hide');
      this.toastr.success('Employee deleted sucessfully..!', 'Success');
    });
  }

  // search by name
  searchId(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.category.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by designation
  searchByDesignation(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.designation.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }

  public getUsers() {

    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }


}
