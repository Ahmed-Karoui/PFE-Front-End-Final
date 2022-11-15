import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';
import {UsersService} from '../../users.service';

declare const $: any;
@Component({
  selector: 'app-clients-content-page',
  templateUrl: './clients-content-page.component.html',
  styleUrls: ['./clients-content-page.component.css'],
})
export class ClientsContentPageComponent implements OnInit, OnDestroy {
  public clientsData = [];
  public editedClient;
  public addClientForm: FormGroup;
  public editClientForm: FormGroup;
  public tempId: any;
  public searchName: any;
  public searchId: any;
  public searchRole: any;
  public roleList = [];
  public filtereddata = [];

  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');

  constructor(
    private allModulesService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService:UsersService
  ) { }

  ngOnInit() {
    this.getClients();

    // Add clients form
    this.addClientForm = this.formBuilder.group({
      clientName: ['', [Validators.required]],
      clientPhone: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      clientEmail: ['', [Validators.required]],
      userRole: ['', [Validators.required]],
      UserGender: ['', [Validators.required]],
      userPhone: ['', [Validators.required]],
      UserPassowrd: ['', [Validators.required]],
      userBirthday: ['', [Validators.required]],
      userHiredate : ['', [Validators.required]],
      userGender: ['', [Validators.required]],
      userManager: ['', [Validators.required]],
      userStatus: ['', [Validators.required]],

    });

    // Edit Clients Form
    this.editClientForm = this.formBuilder.group({
      editClientName: ['', [Validators.required]],
      editClientPhone: ['', [Validators.required]],
      editClientEmail: ['', [Validators.required]],
      editClientCompany: ['', [Validators.required]],
      editClientRole: ['', [Validators.required]],
      editClientId: ['', [Validators.required]],
      editId: ['', [Validators.required]],
    });
  }

  // Get all Clients data
  public getClients() {

    this.userService.getAllUsers().subscribe((data) => {
      this.clientsData = data;
        if (this.roleList.length === 0) {
          this.clientsData.map((client) =>
            this.roleList.push(client.role)
          );
          this.dtTrigger.next();
          this.rows = this.clientsData;
          this.srch = [...this.rows];
        }
              // this.rows = this.allUsers;
      // this.srch = [...this.rows];

      // this.allModulesService.get('clients').subscribe((data) => {
    //   this.clientsData = data;
    //   if (this.roleList.length === 0) {
    //     this.clientsData.map((client) =>
    //       this.roleList.push(client.company)
    //     );
    //
    //     this.dtTrigger.next();
    //     this.rows = this.clientsData;
    //     this.srch = [...this.rows];
    //   }
    });
  }

  // Edit client
  public onEditClient(clientId: any) {
    const client = this.clientsData.filter((client) => client.id === clientId);
    this.editClientForm.setValue({
      editClientName: client[0].name,
      editClientPhone: client[0].phone,
      editClientEmail: client[0].email,
      editClientCompany: client[0].company,
      editClientRole: client[0].role,
      editClientId: client[0].clientId,
      editId: client[0].id,
    });
  }

  // Reset form
  public resetForm() {
    this.addClientForm.reset();
  }

  // Save Client
  public onSave() {
    this.editedClient = {
      name: this.editClientForm.value.editClientName,
      role: 'CEO',
      company: this.editClientForm.value.editClientCompany,
      clientId: this.editClientForm.value.editClientId,
      email: this.editClientForm.value.editClientEmail,
      phone: this.editClientForm.value.editClientPhone,
      id: this.editClientForm.value.editId,
    };
    this.allModulesService.update(this.editedClient, 'clients').subscribe();
    this.getClients();
    $('#edit_client').modal('hide');
    this.toastr.success('Client is updated', 'Success');
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Add new client
  public onAddClient() {
    const newClient = {
      name: this.addClientForm.value.clientName,
      last_name: this.addClientForm.value.LastName,
      email: this.addClientForm.value.clientEmail,
      password: this.addClientForm.value.UserPassowrd,
      Birth_date: this.addClientForm.value.userBirthday,
      Hire_date :this.addClientForm.value.userHiredate,
      role: this.addClientForm.value.userRole,
      gender: this.addClientForm.value.userGender,
      manager: this.addClientForm.value.userManager,
      phone: this.addClientForm.value.userPhone,
      status: this.addClientForm.value.userStatus,
    };
    this.userService.addUser(newClient).subscribe((data) => {
    this.getClients();
    $('#add_client').modal('hide');
    this.toastr.success('Client is added', 'Success');
    });
  }

  // Delete Client
  onDelete(id: any) {
    this.userService.deleteUser(id).subscribe((data) => {
    this.getClients();
    $('#delete_client').modal('hide');
    this.toastr.success('Client is deleted', 'Success');
    });
  }

  // Search Client
  onSearch() {
    this.filtereddata = [];
    this.userService.getAllUsers().subscribe((data) => {
      this.clientsData = data;
      if (this.searchId) {
        this.filtereddata = this.clientsData.filter((data) =>
          data.email.toLowerCase().includes(this.searchId.toLowerCase())
        );
        if (this.searchName) {
          const nameFilter = this.filtereddata.filter((data) =>
            data.name.toLowerCase().includes(this.searchName.toLowerCase())
          );
          if (nameFilter.length != 0) {
            this.filtereddata = nameFilter;
          }
        }
      }

      if (this.searchId || this.searchRole || this.searchName) {
        this.clientsData =
          this.filtereddata.length != 0 ? this.filtereddata : this.clientsData;
      } else {
        this.clientsData = [];
      }
    });
  }

  // search by name
  searchByEmail(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by name
  searchByName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  // search by company
  searchbySexe(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.gender.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  // getting the status value
  getStatus(data) {
    this.statusValue = data;
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
