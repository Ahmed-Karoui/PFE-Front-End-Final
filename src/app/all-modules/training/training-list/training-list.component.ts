import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import {TrainingsService} from '../../trainings.service';
import {UsersService} from '../../users.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {TokenStorageService} from '../../../login/token-storage.service';

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
  public selected;
  currentuser:any;
  disabled = false;
  ShowFilter = true;
  limitSelection = false;
  cities = [];
  selectedItems = [];
  dropdownSettings: any = {};
  public trainedUsers = [];
  public trainersList = [];
  public ;


  public pipe = new DatePipe('en-US');
  public rows = [];
  public srch = [];
  public statusValue;
  constructor(
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private trainingService:TrainingsService,
    private userService:UsersService,
    private tokenStorage:TokenStorageService
  ) {}

  ngOnInit() {
    this.currentuser = this.tokenStorage.getUser();
    this.dropdownSettings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: this.ShowFilter,

    };
    this.getResponsibles();
    this.getUsers();
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
      city: [this.selectedItems]
    });

    this.editEmployeeForm = this.formBuilder.group({
      EdittrainingName: ['', [Validators.required]],
      EdittrainingDescription: ['', [Validators.required]],
      EdittrainingStatus: ['', [Validators.required]],
      EditDeadline: ['', [Validators.required]],
      EdittrainingCategory: ['', [Validators.required]],
      EdittrainingLink: ['', [Validators.required]],
      EdittrainingResponsible: ['', [Validators.required]],
      EdittrainingType: ['', [Validators.required]],
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
      training_responsible:this.addEmployeeForm.value.trainingResponsible.name,
      training_type:this.addEmployeeForm.value.trainingType,
      users:this.trainedUsers
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
  deleteEmployee(id) {
    this.trainingService.deleteTraining(id).subscribe((data) => {
      $('#delete_employee').modal('hide');
      window.location.reload();
      this.loadEmployee();
      this.toastr.success('Training Has been deleted sucessfully..!', 'Success');
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
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
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

  onItemSelect(item: any) {
    console.log('onItemSelect', item);
    this.trainedUsers.push(item._id)
  }
  onSelectAll(items: any) {
    console.log('onSelectAll', items);
  }
  toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
  }

  handleLimitSelection() {
    if (this.limitSelection) {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
      this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
  }


  public getResponsibles() {

    this.userService.getAllUsers().subscribe((data) => {
      this.trainersList = data;
    });
  }

  checkManager(){
  return this.currentuser.role != 'Service Manager';
  }




  saveTraining(id){
    const editedTraining = {
      name: this.editEmployeeForm.value.EdittrainingName,
      description: this.editEmployeeForm.value.EdittrainingDescription,
      status: this.editEmployeeForm.value.EdittrainingStatus,
      category: this.editEmployeeForm.value.EdittrainingCategory,
      training_date: this.editEmployeeForm.value.EditDeadline,
      training_link:this.editEmployeeForm.value.EdittrainingLink,
      training_responsible:this.editEmployeeForm.value.EdittrainingResponsible.name,
      training_type:this.editEmployeeForm.value.EdittrainingType,
    };
    this.trainingService.updateTraining(editedTraining, id).subscribe((data1) => {
    this.loadEmployee();
    $('#edit_employee').modal('hide');
    this.editEmployeeForm.reset();
    this.toastr.success('Ticket updated successfully', 'Success');
    this.loadEmployee()
  });
  }

  // editTraining(value) {
  //   this.editId = value;
  //   const index = this.lstEmployee.findIndex((item) => {
  //     return item.id === value;
  //   });
  //   const toSetValues = this.lstEmployee[index];
  //   this.editEmployeeForm.setValue({
  //     EdittrainingName: toSetValues.name,
  //     EdittrainingDescription: toSetValues.description,
  //     EdittrainingStatus: toSetValues.status,
  //     EditDeadline: toSetValues.training_date,
  //     EdittrainingCategory: toSetValues.category,
  //     EdittrainingLink: toSetValues.training_link,
  //     EdittrainingResponsible: toSetValues.training_responsible,
  //     EdittrainingType: toSetValues.training_type,
  //
  //
  //   });
  // }

  editTraining(id: any) {
    this.tempId = id;
    const training = this.lstEmployee.filter((client) => client._id === id);
    console.log(training)
    this.editEmployeeForm.setValue({
      EdittrainingName: training[0].name,
      EdittrainingDescription: training[0].description,
      EdittrainingStatus: training[0].status,
      EditDeadline: training[0].training_date,
      EdittrainingCategory: training[0].category,
      EdittrainingLink: training[0].training_link,
      EdittrainingResponsible: training[0].training_responsible,
      EdittrainingType: training[0].training_type,
    });
  }



}
