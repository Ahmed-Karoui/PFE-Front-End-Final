import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import {CandidatesServices} from '../../candidates.services';
declare const $: any;

@Component({
  selector: 'app-savedjobs-list',
  templateUrl: './savedjobs-list.component.html',
  styleUrls: ['./savedjobs-list.component.css']
})
export class SavedjobsListComponent implements OnInit, OnDestroy   {
	@ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  // public lstUseralljobs: any[];
	public url: any = "savedjobs";
	public tempId: any;
  candidatesinterviewing = [];
    public editId: any;
    public lstSavedjobs;

    public rows = [];
  public srch = [];

  constructor(
  	private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private candidatesService:CandidatesServices
  	) { }

  ngOnInit() {
    this.getCandidatesoninterviewing();
  	this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  	this.LoadSavedjobs();
  }

   // Get department list  Api Call
  LoadSavedjobs() {
    this.srvModuleService.get(this.url).subscribe((data) => {
      this.lstSavedjobs = data;
      this.dtTrigger.next();
       this.rows = this.lstSavedjobs;
      this.srch = [...this.rows];

      });
  }

 deleteSavedjobs() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
    	  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });

      this.LoadSavedjobs();
      $("#delete_savedjobslist").modal("hide");
      this.toastr.success("Saved-jobs deleted sucessfully..!", "Success");
    });
  }


  //search by Department
  searchDepartment(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by jobtype
  searchJobtype(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by designation
  searchJobtitle(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.gender.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public getCandidatesoninterviewing() {

    this.candidatesService.getAllCandidatesinInterview().subscribe((data) => {
      this.candidatesinterviewing = data;});
  }


  // search by name
  searchName(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  searchEmail(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.email.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  searchGender(val) {
    this.rows.splice(0, this.rows.length);
    const temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.gender.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }


}
