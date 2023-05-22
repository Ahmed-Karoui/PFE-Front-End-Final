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
  file: File = null;
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
  public managersList = [];
  public selectedManager;


  @ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  public rows = [];
  public srch = [];
  public statusValue;
  public dtTrigger: Subject<any> = new Subject();
  public pipe = new DatePipe('en-US');
  public usersList = [];
  public hiredate;
  public birthdate;
  public Status;
  public EditID;
  public EmpManager;
  preview: string;
  imagePreview: any;
  public formData = new FormData();
  public formData2: any = new FormData();





  constructor(
    private allModulesService: AllModulesService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService:UsersService
  ) { }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }


  ngOnInit() {
    this.getClients();
    this.getManager();
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
      sampleFile: ['', [Validators.required]],

    });

    // Edit Clients Form
    this.editClientForm = this.formBuilder.group({
      editClientName: ['', [Validators.required]],
      editClientLastName: ['', [Validators.required]],
      editClientPhone: ['', [Validators.required]],
      editClientEmail: ['', [Validators.required]],
      editClientRole: ['', [Validators.required]],
      editId: ['', [Validators.required]],
      editClientBirthday: ['', [Validators.required]],
      editClientHiredate: ['', [Validators.required]],
      editClientGender: ['', [Validators.required]],
      editClientManager: ['', [Validators.required]],

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

    });
  }

  // Edit client
  public onEditClient(clientId: any) {
    const client = this.clientsData.filter((client) => client._id === clientId);
    this.hiredate = client[0].Hire_date;
    this.birthdate = client[0].Birth_date;
    this.EditID=client[0]._id;
    this.EmpManager=client[0].manager;

    console.log(client);
    this.editClientForm.setValue({
      editClientName: client[0].name,
      editClientPhone: client[0].phone,
      editClientEmail: client[0].email,
      editClientRole: client[0].role,
      editId: client[0]._id,
      editClientLastName: client[0].last_name,
      editClientBirthday: client[0].Birth_date,
      editClientHiredate: client[0].Hire_date,
      editClientGender: client[0].gender,
      editClientManager: client[0].manager,
  });

    this.editedClient = {
      editClientName: client[0].name,
      editClientLastName: client[0].last_name,
      editClientPhone: client[0].phone,
      editClientEmail: client[0].email,
      editClientRole: client[0].role,
      editId: client[0]._id,
      editClientBirthday: client[0].Birth_date,
      editClientHiredate: client[0].Hire_date,
      editClientGender: client[0].gender,
      editClientManager: client[0].manager,
    };
  }
  public updateUser(){
    let updatedUser = {
      name: this.editClientForm.value.editClientName,
      last_name: this.editClientForm.value.editClientLastName,
      phone: this.editClientForm.value.editClientPhone,
      email: this.editClientForm.value.editClientEmail,
      role: this.editClientForm.value.editClientRole,
      Birth_date: this.editClientForm.value.editClientBirthday,
      Hire_date: this.editClientForm.value.editClientHiredate,
      gender: this.editClientForm.value.editClientGender,
      manager: this.editClientForm.value.editClientManager,

    };
    this.userService.updateUser(updatedUser, this.EditID).subscribe((data)=>
    {
      this.getClients();
      $('#edit_client').modal('hide');
      this.toastr.success('Client is updated', 'Success');
  });
  }

  // Reset form
  public resetForm() {
    this.addClientForm.reset();
  }

  // Save Client
  public onSave() {
  }


  private markFormGroupTouched(formGroup: FormGroup) {
    (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }


  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData2.append('sampleFile', file);
    }
  }

  // Add new client
  public onAddClient(file: File) {
    //const fileimage = event.target.files[0];
    // const newClient = {
    //   name: this.addClientForm.value.clientName,
    //   last_name: this.addClientForm.value.LastName,
    //   email: this.addClientForm.value.clientEmail,
    //   password: this.addClientForm.value.UserPassowrd,
    //   Birth_date: this.addClientForm.value.userBirthday,
    //   Hire_date :this.addClientForm.value.userHiredate,
    //   role: this.addClientForm.value.userRole,
    //   gender: this.addClientForm.value.userGender,
    //   manager: this.addClientForm.value.userManager.name,
    //   phone: this.addClientForm.value.userPhone,
    //   sampleFile: this.addClientForm.value.userAvatar
    // };
    console.log(this.addClientForm.value.clientName)
    this.formData2.append('name', this.addClientForm.value.clientName);
    this.formData2.append('last_name', this.addClientForm.value.LastName);
    this.formData2.append('email', this.addClientForm.value.clientEmail);
    this.formData2.append('password', this.addClientForm.value.UserPassowrd);
    this.formData2.append('Birth_date', this.addClientForm.value.userBirthday);
    this.formData2.append('Hire_date', this.addClientForm.value.userHiredate);
    this.formData2.append('role', this.addClientForm.value.userRole);
    this.formData2.append('gender', this.addClientForm.value.userGender);
    this.formData2.append('manager', this.addClientForm.value.userManager.name);
    this.formData2.append('phone', this.addClientForm.value.userPhone);
    this.formData2.append('sampleFile', this.file);
    this.userService.addUser(this.formData2).subscribe((data) => {
    this.getClients();
    $('#add_client').modal('hide');
    this.toastr.success('User has been added successfully ', 'Success');
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


  // Image Preview
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addClientForm.patchValue({
      avatar: file,
    });
    this.addClientForm.get('userAvatar').updateValueAndValidity();

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  public getManager() {

    this.userService.getAllManagers().subscribe((data) => {
      this.managersList = data;
      if (this.roleList.length === 0) {
        this.clientsData.map((client) =>
          this.roleList.push(client.role)
        );
        this.dtTrigger.next();
        this.rows = this.clientsData;
        this.srch = [...this.rows];
      }
    });
  }


  // onFileSelect(event): void {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     const formData = new FormData();
  //     formData.append('file', file);
  //
  //     this.http.post('/api/upload', formData).subscribe(
  //       (response) => console.log(response),
  //       (error) => console.error(error)
  //     );
  //   }
  // }


}
