import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AllModulesService } from '../../all-modules.service';
import {UsersService} from '../../users.service';
import {AppraisalsService} from '../../appraisals.service';
import {TokenStorageService} from '../../../login/token-storage.service';

declare const $: any;
@Component({
  selector: 'app-performance-appraisal',
  templateUrl: './performance-appraisal.component.html',
  styleUrls: ['./performance-appraisal.component.css'],
})
export class PerformanceAppraisalComponent implements OnInit, OnDestroy {
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  lstData: any[];
  url: any = 'performanceappraisal';
  currentuser:any;

  public tempId: any;
  public editId: any;
  public selectedEmployee;
  public usersList;
  public appraisalsList = [];

  public addApparaisalForm: FormGroup;
  public editApparaisalForm: FormGroup;
  public pipe = new DatePipe('en-US');
  public rows = [];
  public srch = [];
  public statusValue;
  public evaluator;
  public dtTrigger: Subject<any> = new Subject();
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private userService:UsersService,
    private appraisalService:AppraisalsService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getAppraisals();
    this.currentuser = this.tokenStorage.getUser();

    /// validation for apparaisal form
    this.addApparaisalForm = this.formBuilder.group({
      EmployeeName: ['', [Validators.required]],
      SelectDate: ['', [Validators.required]],
      StatusName: ['', [Validators.required]],
      appraisalmeetingDate: ['', [Validators.required]],
      departementEmployee:['', [Validators.required]],
    });

    this.editApparaisalForm = this.formBuilder.group({
      EmployeeName: ['', [Validators.required]],
      SelectDate: ['', [Validators.required]],
      StatusName: ['', [Validators.required]],
    });
    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: 'lrtip',
    };
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Add  apparaisal type  Modal Api Call
  addApparaisal() {
      const obj = {
        user_name: this.addApparaisalForm.value.EmployeeName.name,
        user_id:this.addApparaisalForm.value.EmployeeName._id,
        previous_date: this.addApparaisalForm.value.appraisalmeetingDate,
        department:this.addApparaisalForm.value.departementEmployee,
        user_mail:this.addApparaisalForm.value.EmployeeName.email,
        evaluator_name:this.currentuser.name,
        evaluator_lastname:this.currentuser.last_name,
        evaluator_id:this.currentuser.id,
        evaluator_mail:this.currentuser.email,

      };
      console.log(obj)
      this.appraisalService.addAppraisal(obj).subscribe((data) => {
        $('#datatable').DataTable().clear();
      });
      $('#add_appraisal').modal('hide');
      this.addApparaisalForm.reset();
    this.getAppraisals()
    this.toastr.success('Apparaisal added sucessfully...!', 'Success');
  }
  // Edit apparaisal Modal Api Call

  editApparaisal() {
    if (this.editApparaisalForm.valid) {
      const apparaisalDate = this.pipe.transform(
        this.editApparaisalForm.value.SelectDate,
        'dd-MM-yyyy'
      );
      const obj = {
        employee: this.editApparaisalForm.value.EmployeeName,
        apparaisaldate: apparaisalDate,
        designation: 'Web Designer',
        department: 'Web development',
        status: this.editApparaisalForm.value.StatusName,
        id: this.editId,
      };
      this.srvModuleService.update(obj, this.url).subscribe((data) => {
        $('#datatable').DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });
      $('#edit_appraisal').modal('hide');
      this.toastr.success('Apparaisal updated sucessfully...!', 'Success');
    }
  }
  edit(value) {
    this.editId = value;
    const index = this.lstData.findIndex((item) => {
      return item.id === value;
    });
    const toSetValues = this.lstData[index];
    this.editApparaisalForm.setValue({
      EmployeeName: toSetValues.employee,
      SelectDate: toSetValues.apparaisaldate,
      StatusName: toSetValues.status
    });
  }

  // Delete apparaisal Modal Api Call

  deleteApparaisal() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
      $('#datatable').DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    });
    $('#delete_appraisal').modal('hide');
    this.toastr.success('Record deleted sucessfully...!', 'Success');
  }

  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public getUsers() {

    this.userService.getAllUsers().subscribe((data) => {
      this.usersList = data;
    });
  }

  public getAppraisals(){
    this.appraisalService.getAllAppraisals().subscribe((data)=>{
      this.appraisalsList = data;
    })
  }

  checkManager(){
    return this.currentuser != 'Service Manager';
  }
}
