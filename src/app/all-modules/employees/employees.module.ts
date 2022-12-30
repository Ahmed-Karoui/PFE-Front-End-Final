import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { AllEmployeesComponent } from './all-employees/all-employees.component';
import { EmployeePageContentComponent } from './all-employees/employee-page-content/employee-page-content.component';
import { EmployeeListComponent } from './all-employees/employee-list/employee-list.component';
import { EmployeeProfileComponent } from './all-employees/employee-profile/employee-profile.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { LeavesAdminComponent } from './leaves-admin/leaves-admin.component';
import { LeavesEmployeeComponent } from './leaves-employee/leaves-employee.component';
import { LeaveSettingsComponent } from './leave-settings/leave-settings.component';
import { AttendanceAdminComponent } from './attendance-admin/attendance-admin.component';
import { AttendanceEmployeeComponent } from './attendance-employee/attendance-employee.component';
import { DepartmentsComponent } from './departments/departments.component';
import { DesignationComponent } from './designation/designation.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { OvertimeComponent } from './overtime/overtime.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharingModule } from 'src/app/sharing/sharing.module';
import { PickListModule } from 'primeng/picklist';
import {TrainingListComponent} from '../training/training-list/training-list.component';
import {TrainingModule} from '../training/training.module';
import {NgSelect2Module} from 'ng-select2';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [EmployeesComponent, AllEmployeesComponent, EmployeePageContentComponent, EmployeeListComponent, EmployeeProfileComponent, HolidaysComponent, LeavesAdminComponent, LeavesEmployeeComponent, LeaveSettingsComponent, AttendanceAdminComponent, AttendanceEmployeeComponent, DepartmentsComponent, DesignationComponent, TimesheetComponent, OvertimeComponent,TrainingListComponent],
    imports: [
        CommonModule,
        FormsModule,
        SharingModule,
        ReactiveFormsModule,
        PickListModule,
        EmployeesRoutingModule, PickListModule,
        BsDatepickerModule.forRoot(),
        DataTablesModule, NgSelect2Module, NgMultiSelectDropDownModule,
    ]
})

export class EmployeesModule { }
