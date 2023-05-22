import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AllModulesService } from '../../all-modules.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import {LeavesService} from '../../leaves.service';
import {TokenStorageService} from '../../../login/token-storage.service';
import {UsersService} from '../../users.service';
import {endOfDay, startOfDay} from 'date-fns';
declare const $: any;
@Component({
  selector: 'app-leaves-admin',
  templateUrl: './leaves-admin.component.html',
  styleUrls: ['./leaves-admin.component.css'],
})
export class LeavesAdminComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public lstLeave: any;
  public url: any = 'adminleaves';
  public tempId: any;
  public tempStartdata:any;
  public tempEnddata:any;
  public editId: any;
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');
  public addLeaveadminForm: FormGroup;
  public editLeaveadminForm: FormGroup;
  public editFromDate: any;
  public editToDate: any;
  public currentuser;
  public UsersFound = [];
  public overweek = [];
  constructor(
    private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private leavesservices:LeavesService,
    private tokenStorage: TokenStorageService,
    private userService:UsersService
  ) {}

  ngOnInit() {
    this.currentuser = this.tokenStorage.getUser();
    // for floating label
    $('.floating')
      .on('focus blur', function (e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');

    this.loadLeaves();

    this.addLeaveadminForm = this.formBuilder.group({
      LeaveType: ['', [Validators.required]],
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  // manually rendering Data table

  rerender(): void {
    $('#datatable').DataTable().clear();
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.lstLeave = [];
    this.loadLeaves();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }
  // Get leave  Api Call
  loadLeaves() {
    this.leavesservices.getAllUnvalidatedLeaves().subscribe((data) => {
      this.lstLeave = data;
      this.rows = this.lstLeave;
      this.srch = [...this.rows];
      console.log(this.lstLeave);
      for (let i = 0; this.lstLeave.length ; i++) {
        console.log(this.lstLeave[i]._id)
        this.UsersFound.push(this.getUsers(this.lstLeave[i]._id))
        this.UsersFound.filter(Boolean)
        console.log(this.UsersFound)

      }
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
  // Add leaves for admin Modal Api Call
  addleaves() {
    if(this.addLeaveadminForm.invalid){
      this.markFormGroupTouched(this.addLeaveadminForm)
      return
    }
    if (this.addLeaveadminForm.valid) {
      const fromDate = this.pipe.transform(
        this.addLeaveadminForm.value.From,
        'dd-MM-yyyy'
      );
      const toDate = this.pipe.transform(
        this.addLeaveadminForm.value.To,
        'dd-MM-yyyy'
      );
      const obj = {
        employeeName: 'Mike Litorus',
        designation: 'web developer',
        leaveType: this.addLeaveadminForm.value.LeaveType,
        from: fromDate,
        to: toDate,
        noofDays: this.addLeaveadminForm.value.NoOfDays,
        remainleaves: this.addLeaveadminForm.value.RemainLeaves,
        reason: this.addLeaveadminForm.value.LeaveReason,
        status: 'Approved',
      };
      this.srvModuleService.add(obj, this.url).subscribe((data) => {
        $('#datatable').DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });
      this.loadLeaves();
      $('#add_leave').modal('hide');
      this.addLeaveadminForm.reset();
      this.toastr.success('Leaves added sucessfully...!', 'Success');
    } else {
      this.toastr.warning('Mandatory fields required', '');
    }
  }

  // to know the date picker changes

  from(data) {
    this.editFromDate = this.pipe.transform(data, 'dd-MM-yyyy');
  }
  to(data) {
    this.editToDate = this.pipe.transform(data, 'dd-MM-yyyy');
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
        $('#datatable').DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
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
      $('#datatable').DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    });
    this.loadLeaves();
    $('#delete_approve').modal('hide');
    this.toastr.success('Leaves deleted sucessfully..!', 'Success');
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

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }


  // search by status
  searchType(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  searchStatus(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by purchase
  searchByFrom(val) {
    const mySimpleFormat = this.pipe.transform(val, 'yyyy-MM-dd');
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      return d.start_date.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });
    this.rows.push(...temp);
    $('.floating')
      .on('focus blur', function (e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');
  }

  // search by warranty
  searchByTo(val) {
    const mySimpleFormat = this.pipe.transform(val, 'yyyy-MM-dd');
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      return d.end_date.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
    });
    this.rows.push(...temp);
    $('.floating')
      .on('focus blur', function (e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');
  }

  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // getDiffDays(startDate, endDate) {
  //   return Math.ceil(Math.abs(startDate - endDate) / (1000 * 60 * 60 * 24));
  // }

  getDiffDays(startDate, endDate){
    let startdate = new Date(startDate);
    let enddate = new Date(endDate);

    let days = Math.floor((enddate.getTime() - startdate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }


  validateLeave(id){
    this.leavesservices.validateLeave(id).subscribe(response => {
      console.log(response);
    })
    $('#approve_leave').modal('hide');
    this.loadLeaves();
    this.toastr.success('Leave Has Been Validated sucessfully...!', 'Success');
    window.location.reload();
  }
  rejectLeave(id,start_date,end_date){

    let mySessionData = JSON.parse(window.sessionStorage.getItem('auth-user')|| '{}');
    mySessionData.days_off = this.currentuser.days_off + this.getDiffDays(startOfDay(start_date),endOfDay(end_date))
    sessionStorage.setItem('auth-user', JSON.stringify(mySessionData));

    const newDuration= {
      days_off:mySessionData.days_off
    }
    console.log(this.getDiffDays(startOfDay(start_date),endOfDay(end_date)))
      this.leavesservices.rejectLeave(id).subscribe(response => {
      console.log(response);
        this.userService.updateUser(newDuration,this.currentuser.id).subscribe((data) => {
          console.log("updated")
        })
    })
    $('#reject_leave').modal('hide');
    this.loadLeaves();
    this.toastr.warning('Leave Has Been Rejected...!', 'Warning');
    window.location.reload();
  }


  getUsers(id) {
    this.leavesservices.getUersForLeave(id).subscribe((data) => {
      this.UsersFound.push(data);
    });
  }
}
