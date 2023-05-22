import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {TokenStorageService} from '../../../login/token-storage.service';
import {LeavesService} from '../../leaves.service';
import {UsersService} from '../../users.service';
declare const $: any;
@Component({
  selector: 'app-leaves-employee',
  templateUrl: './leaves-employee.component.html',
  styleUrls: ['./leaves-employee.component.css'],
})
export class LeavesEmployeeComponent implements OnInit, OnDestroy {
  public lstLeave: any[];
  url: any = 'employeeleaves';
  public tempId: any;
  public editId: any;

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public rows = [];
  public srch = [];
  public result = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public addLeaveadminForm: FormGroup;
  public ListLeaves: any = [];
  public editLeaveadminForm: FormGroup;
  public editFromDate: any;
  public editToDate: any;
  public currentuser;
  public userLeaveDays;
  constructor(
    private tokenStorage: TokenStorageService,
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private leavesservices:LeavesService,
    private userService:UsersService
  ) {}

  ngOnInit() {
    this.loadLeaves();
    console.log(this.lstLeave)
    this.currentuser = this.tokenStorage.getUser();
    this.userLeaveDays = this.currentuser.days_off;

    this.addLeaveadminForm = this.formBuilder.group({
      addLeaveType: ['', [Validators.required]],
      From: ['', [Validators.required]],
      To: ['', [Validators.required]],
      NoOfDays: ['', [Validators.required]],
      RemainLeaves: ['', [Validators.required]],
      LeaveReason: ['', [Validators.required]],
    });

    // Edit leaveadmin Form Validation And Getting Values

    this.editLeaveadminForm = this.formBuilder.group({
      LeaveType: ['', [Validators.required]],
      From: ['', [Validators.required]],
      To: ['', [Validators.required]],
      NoOfDays: ['', [Validators.required]],
      RemainLeaves: ['', [Validators.required]],
      LeaveReason: ['', [Validators.required]],
    });

    // for data table configuration
    this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: 'lrtip',
    };
  }

  // Get leave  Api Call
  loadLeaves() {
    this.leavesservices.getAllLeaves().subscribe((data) => {
      this.ListLeaves = data;
      this.dtTrigger.next();
      this.rows = this.ListLeaves;
      this.srch = [...this.rows];
      console.log(this.rows)
      this.result = (this.rows.filter(x => x.owner === this.currentuser.id));
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

  // Edit leaves Modal Api Call
  editLeaves() {
    if (this.editLeaveadminForm.valid) {
      const obj = {
        employeeName: 'Mike Litorus',
        designation: 'web developer',
        leaveType: this.editLeaveadminForm.value.LeaveType,
        from: this.editFromDate,
        to: this.editToDate,
        noofDays: this.editLeaveadminForm.value.NoOfDays,
        remainleaves: this.editLeaveadminForm.value.RemainLeaves,
        reason: this.editLeaveadminForm.value.LeaveReason,
        status: 'Approved',
        id: this.editId,
      };
      this.srvModuleService.update(obj, this.url).subscribe((data) => {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
      });
      this.loadLeaves();
      $('#edit_leave').modal('hide');
      this.toastr.success('Leaves Updated sucessfully...!', 'Success');
    } else {
      this.toastr.warning('Mandatory fields required', '');
    }
  }

  // Delete leaves Modal Api Call

  deleteleaves() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.loadLeaves();
      $('#delete_approve').modal('hide');
      this.toastr.success('Leaves deleted sucessfully..!', 'Success');
    });
  }

  // To Get The leaves Edit Id And Set Values To Edit Modal Form

  edit(value) {
    this.editId = value;
    const index = this.lstLeave.findIndex((item) => {
      return item.id === value;
    });
    const toSetValues = this.lstLeave[index];
    this.editLeaveadminForm.setValue({
      LeaveType: toSetValues.leaveType,
      From: toSetValues.from,
      To: toSetValues.to,
      NoOfDays: toSetValues.noofDays,
      RemainLeaves: toSetValues.remainleaves,
      LeaveReason: toSetValues.reason,
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getDiffDays(startDate, endDate){
    let startdate = new Date(startDate);
    let enddate = new Date(endDate);

    let days = Math.floor((enddate.getTime() - startdate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }






}
