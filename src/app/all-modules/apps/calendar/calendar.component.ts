import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {LeavesService} from '../../leaves.service';
import {ToastrService} from 'ngx-toastr';
import {TokenStorageService} from '../../../login/token-storage.service';
import {UsersService} from '../../users.service';
import {AppraisalsService} from '../../appraisals.service';
import {TrainingsService} from '../../trainings.service';

declare const $: any;

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#3a9c33',
    secondary: '#FDF1BA',
  },
  pink: {
    primary: '#f26de7',
    secondary: '#FDF1BA',
  },
  orange: {
    primary: '#fd7e14',
    secondary: '#FDF1BA',
  },
  prime: {
    primary: '#337ab7;',
    secondary: '#FDF1BA',
  },
  info: {
    primary: '#269abc',
    secondary: '#FDF1BA',
  },
  warning: {
    primary: '#d58512',
    secondary: '#FDF1BA',
  },
  purple: {
    primary: '#609',
    secondary: '#FDF1BA',
  },
  brown: {
    primary: '#613312',
    secondary: '#FDF1BA',
  },
  teal: {
    primary: '#008080',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  public allLeaves: any = [];
  constructor(private modal: NgbModal,private leaveservice: LeavesService, private toastr: ToastrService,private tokenStorage: TokenStorageService,
              private userService:UsersService,private appraisalService:AppraisalsService,private trainingService:TrainingsService
  ) {}
  bsInlineRangeValue: Date[];
  eventName: string;
  category: string;
  editEventName: string;
  editCategory: string;
  editAction;
  editCalendarEvent;
  currentuser:any;
  employeeLeaves = [];
  employeeAppraisals = [];


  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();


  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.handleEvent("Edited", event);
        $('#edit_event').modal('show');
        this.editedValue('Edited', event);
      },
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] =  this.allLeaves;

  activeDayIsOpen = true;

  editedValue(action: string, event: CalendarEvent) {
    this.editAction = action;
    this.editCalendarEvent = event;
  }

  getLeaves() {
    this.leaveservice.getAllLeaves().subscribe((data) => {
      this.employeeLeaves = data;
      data = (this.employeeLeaves.filter(x => x.owner === this.currentuser.id));
      console.log(data)
      data.forEach(element => {
        let validatedelement ;
        if (element.status === 'Waiting For Approval'){
          validatedelement = colors.red
        }
        else {
          validatedelement = colors.green
        }
        var elem = {
          start: subDays(startOfDay(new Date(element.start_date).toUTCString()), 1),
          end: addDays(new Date(element.end_date).toUTCString(), 1),
          title: element.title,
          color: validatedelement,
        }
        console.log(elem)
        this.events.push(elem)
      })
    });
  }

  getAppraisal() {
    this.appraisalService.getAllAppraisals().subscribe((data1) => {
      this.employeeAppraisals = data1
      data1 = (this.employeeAppraisals.filter(x => x.user_id === this.currentuser.id));
      console.log(data1)
      data1.forEach(element => {
        var elem = {
        start: subDays(startOfDay(new Date(element.previous_date).toUTCString()), 1),
        end: subDays(startOfDay(new Date(element.previous_date).toUTCString()), 1),
        title: "Appraisal Meeting",
        color: colors.blue,
      }
      console.log(elem)
      this.events.push(elem)
    })
  });
}

  getTraining() {
    this.trainingService.getAlltrainings().subscribe((data2) => {
      this.employeeAppraisals = data2
      data2 = (this.employeeAppraisals.filter(x => x.users.includes(this.currentuser.id)));
      console.log(data2)
      data2.forEach(element => {
        var elem = {
          start: subDays(startOfDay(new Date(element.training_date).toUTCString()), 1),
          end: subDays(startOfDay(new Date(element.training_date).toUTCString()), 1),
          title: element.name,
          color: colors.brown,
        }
        console.log(elem)
        this.events.push(elem)
      })
    });
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  openAddEventModal() {
    this.bsInlineRangeValue = [];
    $('#add_event').modal('show');
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // this.modal.open(this.modalContent, { size: "lg" });
  }

  getDiffDays(startDate, endDate){
    let startdate = new Date(startDate);
    let enddate = new Date(endDate);

    let days = Math.floor((enddate.getTime() - startdate.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }



  addEvent(): void {

    console.log(this.getDiffDays(startOfDay(this.bsInlineRangeValue[1]),endOfDay(this.bsInlineRangeValue[0])))

     let mySessionData = JSON.parse(window.sessionStorage.getItem('auth-user')|| '{}');
     mySessionData.days_off = mySessionData.days_off + this.getDiffDays(startOfDay(this.bsInlineRangeValue[1]),endOfDay(this.bsInlineRangeValue[0]))
     sessionStorage.setItem('auth-user', JSON.stringify(mySessionData));

    const newDuration= {
      days_off:mySessionData.days_off
    }
    const newLeave = {
      title: this.eventName,
      start_date: startOfDay(this.bsInlineRangeValue[0]),
      end_date: endOfDay(this.bsInlineRangeValue[1]),
      status:'Waiting For Approval',
      owner:this.currentuser.id
    }
    // console.log(this.currentuser)
    this.leaveservice.addLeave(newLeave).subscribe((data) => {
    $('#add_event').modal('hide');
      this.userService.updateUser(newDuration,this.currentuser.id).subscribe((data) => {
        console.log("updated")
      })
      this.toastr.success('Client is added', 'Success');
    });
  }

  editEvent() {
    this.editCalendarEvent.title = this.editEventName;
    if (this.editCategory === 'Danger') {
      this.editCalendarEvent.color = colors.red;
    } else if (this.editCategory === 'Success') {
      this.editCalendarEvent.color = colors.green;
    } else if (this.editCategory === 'Pink') {
      this.editCalendarEvent.color = colors.pink;
    } else if (this.editCategory === 'Purple') {
      this.editCalendarEvent.color = colors.purple;
      this.editCalendarEvent.color = colors.purple;
      this.editCalendarEvent.color = colors.purple;
    } else if (this.editCategory === 'Primary') {
      this.editCalendarEvent.color = colors.prime;
    } else if (this.editCategory === 'Info') {
      this.editCalendarEvent.color = colors.info;
    } else if (this.editCategory === 'Orange') {
      this.editCalendarEvent.color = colors.orange;
    } else if (this.editCategory === 'Warning') {
      this.editCalendarEvent.color = colors.warning;
    } else if (this.editCategory === 'Brown') {
      this.editCalendarEvent.color = colors.yellow;
    } else if (this.editCategory === 'Teal') {
      this.editCalendarEvent.color = colors.teal;
    }

    // this.editCalendarEvent.start = startOfDay(this.bsInlineRangeValue[0]);
    // this.editCalendarEvent.end = endOfDay(this.bsInlineRangeValue[1]);
    this.handleEvent(this.editEventName, this.editCalendarEvent);
    $('#edit_event').modal('hide');
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnInit() {
    this.getLeaves();
    this.getAppraisal();
    this.getTraining();
    this.currentuser = this.tokenStorage.getUser();

  }
}
