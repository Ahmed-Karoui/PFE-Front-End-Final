import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppsRoutingModule } from './apps-routing.module';
import { AppsComponent } from './apps.component';

// import filepond module
import { FilePondModule } from 'ngx-filepond';

// Tooltip module
import { TooltipModule } from 'ngx-bootstrap';

// Calendar Module
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// Date picker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Search Filter
import { Ng2SearchPipeModule } from 'ng2-search-filter';


import { CalendarComponent } from './calendar/calendar.component';
import { HttpClientModule } from '@angular/common/http';
import { AppsServiceService } from './apps-service.service';

@NgModule({
  declarations: [
    AppsComponent,
    CalendarComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    FilePondModule,
    FormsModule,
    ReactiveFormsModule,
    AppsRoutingModule,
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    Ng2SearchPipeModule
  ],
  providers: [
    AppsServiceService,
  ]
})
export class AppsModule { }
