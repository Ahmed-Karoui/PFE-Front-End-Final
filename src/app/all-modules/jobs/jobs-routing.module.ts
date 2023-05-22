import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobsComponent } from './jobs.component';
import { ManageJobsComponent } from './manage-jobs/manage-jobs.component';
import { JobDetailsComponent } from './manage-jobs/job-details/job-details.component';
import { JobApplicantsComponent } from './manage-jobs/job-applicants/job-applicants.component';
import {JobDetailsInterviewComponent} from './job-details-interviewing/job-details.component';
import {JobDetailsOfferComponent} from './job-details-offered/job-details.component';
import {JobDetailsConfirmedComponent} from './job-details-confirmed/job-details.component';
import {JobDetailsRejectedComponent} from './job-details-rejected/job-details.component';

const routes: Routes = [
  {
    path:"",
    component:JobsComponent,
    children:[
      {
        path:"manage-jobs",
        component:ManageJobsComponent
      },
      {
        path:"job-details/:id",
        component:JobDetailsComponent
      },
      {
        path:"job-details-interview/:id",
        component:JobDetailsInterviewComponent
      },
      {
        path:"job-details-offer/:id",
        component:JobDetailsOfferComponent
      },
      {
        path:"job-details-confirmed/:id",
        component:JobDetailsConfirmedComponent
      },
      {
        path:"job-details-rejected/:id",
        component:JobDetailsRejectedComponent
      },
      {
        path:"job-applicants",
        component:JobApplicantsComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
