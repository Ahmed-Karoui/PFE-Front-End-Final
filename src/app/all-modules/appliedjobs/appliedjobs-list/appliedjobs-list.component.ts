import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AllModulesService } from "../../all-modules.service";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import {CandidatesServices} from '../../candidates.services';
declare const $: any;

@Component({
  selector: 'app-appliedjobs-list',
  templateUrl: './appliedjobs-list.component.html',
  styleUrls: ['./appliedjobs-list.component.css']
})
export class AppliedjobsListComponent implements OnInit, OnDestroy  {
	@ViewChild(DataTableDirective, { static: false })
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();
  // public lstUseralljobs: any[];
	public url: any = "appliedjobs";
	public tempId: any;
  public candidatesoffered = [];
    public editId: any;
    public lstAppliedjobs;

    public rows = [];
  public srch = [];

  constructor(
  	private formBuilder: FormBuilder,
    private srvModuleService: AllModulesService,
    private toastr: ToastrService,
    private candidatesService:CandidatesServices
  	) { }

  ngOnInit() {
    this.getCandidatesoffered();
  	this.dtOptions = {
      // ... skipped ...
      pageLength: 10,
      dom: "lrtip",
    };
  	this.LoadAppliedjobs();
  }

   // Get department list  Api Call
  LoadAppliedjobs() {
    this.srvModuleService.get(this.url).subscribe((data) => {
      this.lstAppliedjobs = data;
      this.dtTrigger.next();
       this.rows = this.lstAppliedjobs;
      this.srch = [...this.rows];

      });
  }

  deleteAppliedjobs() {
    this.srvModuleService.delete(this.tempId, this.url).subscribe((data) => {
    	  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });

      this.LoadAppliedjobs();
      $("#delete_appliedjobs").modal("hide");
      this.toastr.success("Applied-jobs deleted sucessfully..!", "Success");
    });
  }


  //search by Department
  searchDepartment(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.department.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by jobtype
  searchJobtype(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.jobtype.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }

  //search by designation
  searchJobtitle(val) {
    this.rows.splice(0, this.rows.length);
    let temp = this.srch.filter(function (d) {
      val = val.toLowerCase();
      return d.jobtitle.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rows.push(...temp);
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  public getCandidatesoffered() {

    this.candidatesService.getAllCandidatesoffered().subscribe((data) => {
      this.candidatesoffered = data;});
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
