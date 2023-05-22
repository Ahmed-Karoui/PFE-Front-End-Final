import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobsRoutingModule } from './jobs-routing.module';
import { JobsComponent } from './jobs.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { DataTablesModule } from 'angular-datatables';
import { JobDetailsComponent } from './manage-jobs/job-details/job-details.component';
import { JobApplicantsComponent } from './manage-jobs/job-applicants/job-applicants.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharingModule } from 'src/app/sharing/sharing.module';
import {JobDetailsInterviewComponent} from './job-details-interviewing/job-details.component';
import {JobDetailsOfferComponent} from './job-details-offered/job-details.component';
import {JobDetailsConfirmedComponent} from './job-details-confirmed/job-details.component';
import {JobDetailsRejectedComponent} from './job-details-rejected/job-details.component';

@NgModule({
  declarations: [JobsComponent, ManageJobsComponent, JobDetailsComponent, JobApplicantsComponent,JobDetailsInterviewComponent,JobDetailsOfferComponent,JobDetailsConfirmedComponent,JobDetailsRejectedComponent],
  imports: [
    CommonModule,
    JobsRoutingModule,
    DataTablesModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    SharingModule
  ]
})
export class JobsModule { }
