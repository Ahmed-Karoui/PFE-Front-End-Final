import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import {TicketsService} from '../../tickets.service';
import {TokenStorageService} from '../../../login/token-storage.service';

declare const $: any;
@Component({
  selector: 'app-tickets-content',
  templateUrl: './tickets-content.component.html',
  styleUrls: ['./tickets-content.component.css'],
})
export class TicketsContentComponent implements OnInit, OnDestroy {

  file: File[] = []
  public formData2: any = new FormData();
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public url: any = 'tickets';
  public allTickets: any = [];
  public addTicketForm: FormGroup;
  public editTicketForm: FormGroup;
  public editId: any;
  public tempId: any;
  public currentUser;

  public rows = [];
  public srch = [];
  public nbticket: any;
  public nbticketsolved: any;
  public nbticketopen: any;
  public nbticketinprogress: any;
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');
  public editCreated: any;
  public editLastDate: any;
  public UsersFound=[];
  constructor(
    private allModuleService: AllModulesService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private ticketService: TicketsService,
    private StorageService:TokenStorageService
  ) {}

  ngOnInit() {

    this.currentUser = this.StorageService.getUser();
    // for floating label
    $('.floating')
      .on('focus blur', function (e) {
        $(this)
          .parents('.form-focus')
          .toggleClass('focused', e.type === 'focus' || this.value.length > 0);
      })
      .trigger('blur');

    this.getTickets();
    // Add Ticket Form Validation And Getting Values
    this.addTicketForm = this.formBuilder.group({
      ticketSubject: ['', [Validators.required]],
      ticketUrgency: ['', [Validators.required]],
      TicketCategory: ['', [Validators.required]],
      TicketDepartement: ['', [Validators.required]],
      TicketContent: ['', [Validators.required]],
      sampleFile: ['', [Validators.required]],

    });

    // Edit Ticket Form Validation And Getting Values

    this.editTicketForm = this.formBuilder.group({
      EditticketSubject: ['', [Validators.required]],
      EditticketUrgency: ['', [Validators.required]],
      EditTicketCategory: ['', [Validators.required]],
      EditTicketDepartement: ['', [Validators.required]],
      EditTicketContent: ['', [Validators.required]],
    });

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
    this.allTickets = [];
    this.getTickets();
    setTimeout(() => {
      this.dtTrigger.next();
    }, 1000);
  }

  // onFilechange(event: any) {
  //
  //   for (let i = 0; i < event.target.files.length; i++) {
  //     console.log(event.target.files[i])
  //     this.file.push(event.target.files[i]);
  //   }
  // }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }

  getTickets() {
    this.ticketService.getAllTickets().subscribe((data) => {
      this.allTickets = data;
      this.rows = this.allTickets;
      this.srch = [...this.rows];
      this.nbticket = this.allTickets.length;
      this.nbticketsolved = this.allTickets.filter(o => o.status === 'Solved').length;
      this.nbticketopen = this.allTickets.filter(o => o.status === 'Active').length;
      this.nbticketinprogress = this.allTickets.filter(o => o.status === 'progress').length;

      for (let i = 0; this.allTickets.length ; i++) {
        console.log(this.allTickets[i]._id)
        this.UsersFound.push(this.getUsers(this.allTickets[i]._id))
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

  // Add Ticket Modal Api Call

  addTickets() {
      // const obj = {
        // description: this.addTicketForm.value.ticketSubject,
        // urgency: this.addTicketForm.value.ticketUrgency,
        // category: this.addTicketForm.value.TicketCategory,
        // departement: this.addTicketForm.value.TicketDepartement,
        // content: this.addTicketForm.value.TicketContent,
        // status: 'Active',
        // user:this.currentUser.id,

        this.formData2.append('description', this.addTicketForm.value.ticketSubject);
        this.formData2.append('urgency', this.addTicketForm.value.ticketUrgency);
        this.formData2.append('category', this.addTicketForm.value.TicketCategory);
        this.formData2.append('departement', this.addTicketForm.value.TicketDepartement);
        this.formData2.append('content', this.addTicketForm.value.TicketContent);
        this.formData2.append('status', 'Active');
        this.formData2.append('user', this.currentUser.id);
        this.formData2.append('sampleFile', this.file);
      // };
      this.ticketService.addTicket(this.formData2).subscribe((data) => {
        $('#datatable').DataTable().clear();
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
        });
        this.dtTrigger.next();
      });
      this.getTickets();
      $('#add_ticket').modal('hide');
      this.addTicketForm.reset();
      this.toastr.success('Tickets added', 'Success');
      this.getTickets();
      window.location.reload();
    }

  // Edit Ticket Modal Api Call

  editTicket(id: any) {
    this.tempId = id;
    const ticket = this.allTickets.filter((client) => client._id === id);
    this.editTicketForm.setValue({
      EditticketSubject: ticket[0].description,
      EditticketUrgency: ticket[0].urgency,
      EditTicketCategory: ticket[0].category,
      EditTicketDepartement: ticket[0].departement,
      EditTicketContent: ticket[0].content
    });
  }
  saveTicket(id){
    const editedTicket = {
      description: this.editTicketForm.value.EditticketSubject,
      urgency: this.editTicketForm.value.EditticketUrgency,
      category: this.editTicketForm.value.EditTicketCategory,
      departement: this.editTicketForm.value.EditTicketDepartement,
      content: this.editTicketForm.value.EditTicketContent,
    };
    this.ticketService.updateTicket(editedTicket, id).subscribe((data1) => {
      $('#datatable').DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    });
    this.getTickets();
    $('#edit_ticket').modal('hide');
    this.editTicketForm.reset();
    this.toastr.success('Ticket updated successfully', 'Success');
    this.getTickets()
  }

  edit(value) {
    this.editId = value;
    const index = this.allTickets.findIndex((item) => {
      return item.id === value;
    });
    const toSetValues = this.allTickets[index];
    this.editTicketForm.setValue({
      EditticketSubject: toSetValues.description,
      EditticketUrgency: toSetValues.urgency,
      EditTicketCategory: toSetValues.category,
      EditTicketDepartement: toSetValues.departement,
      EditTicketContent: toSetValues.content,
    });
  }

  // Delete Ticket Modal Api Call
  deleteTicket(id: any) {
    this.ticketService.deleteTicket(id).subscribe((data) => {
      $('#datatable').DataTable().clear();
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
      this.dtTrigger.next();
    });
    this.getTickets();
    $('#delete_ticket').modal('hide');
    this.getTickets();
    this.toastr.success('Tickets deleted', 'Success');
  }

  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.description.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by status
  searchStatus(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.status.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  searchPriority(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.urgency.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by purchase
  searchFrom(val) {
    const mySimpleFormat = this.pipe.transform(val, 'dd-MM-yyyy');
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      return d.createdDate.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
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
  searchTo(val) {
    const mySimpleFormat = this.pipe.transform(val, 'dd-MM-yyyy');
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      return d.lastReply.indexOf(mySimpleFormat) !== -1 || !mySimpleFormat;
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

  getUsers(id) {
    this.ticketService.getUserInfo(id).subscribe((data) => {
      this.UsersFound.push(data);
    });
  }

}
