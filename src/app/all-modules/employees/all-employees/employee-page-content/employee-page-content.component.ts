import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from 'src/app/all-modules/all-modules.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { id } from 'src/assets/all-modules-data/id';
import {TrainingsService} from '../../../trainings.service';

declare const $: any;
@Component({
  selector: 'app-employee-page-content',
  templateUrl: './employee-page-content.component.html',
  styleUrls: ['./employee-page-content.component.css'],
})
export class EmployeePageContentComponent implements OnInit {
  public lstEmployee: any[];
  public url: any = 'employeelist';
  public tempId: any;
  public editId: any;
  public addEmployeeForm: FormGroup;
  public editEmployeeForm: FormGroup;

  public pipe = new DatePipe('en-US');
  public rows = [];
  public srch = [];
  public statusValue;
  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private trainingService:TrainingsService
  ) {}

  ngOnInit() {
    this.loadEmployee();
    this.addEmployeeForm = this.formBuilder.group({
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
      firstname: this.addEmployeeForm.value.FirstName,
      lastname: this.addEmployeeForm.value.LastName,
      username: this.addEmployeeForm.value.UserName,
      email: this.addEmployeeForm.value.Email,
      password: this.addEmployeeForm.value.Password,
      confirmpassword: this.addEmployeeForm.value.ConfirmPassword,
      employeeId: this.addEmployeeForm.value.EmployeeID,
      joindate: DateJoin,
      phone: this.addEmployeeForm.value.PhoneNumber,
      company: this.addEmployeeForm.value.CompanyName,
      department: this.addEmployeeForm.value.DepartmentName,
      designation: this.addEmployeeForm.value.Designation,
      mobile: '9944996335',
      role: 'Web developer',
    };
    this.srvModuleService.add(obj, this.url).subscribe((data) => {});
    this.loadEmployee();
    $('#add_employee').modal('hide');
    this.addEmployeeForm.reset();
    this.toastr.success('Employeee added sucessfully...!', 'Success');
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
      return d.employeeId.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.firstname.toLowerCase().indexOf(val) !== -1 || !val;
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
}
