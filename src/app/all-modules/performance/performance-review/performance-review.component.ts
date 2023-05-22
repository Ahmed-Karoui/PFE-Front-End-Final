import { Component, OnInit } from '@angular/core';
import {map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AppraisalsService} from '../../appraisals.service';
import {TokenStorageService} from '../../../login/token-storage.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UsersService} from '../../users.service';
declare const $: any;

@Component({
  selector: 'app-performance-review',
  templateUrl: './performance-review.component.html',
  styleUrls: ['./performance-review.component.css']
})
export class PerformanceReviewComponent implements OnInit {
public appraisalId:any;
public appraisal:any;
public appraisals = [];
public Next_date;
public user_name;
public user_id;
public previous_date;
public Hire_date;
public usersList = []
public evaluator;

public departement;
public currentuser:any;
public employee_accomplishement;
public manager_accomplishement;
public explication_employee;
public objectif1_employee;
public objectif2_employee;
public addtional_notes_employee;
public addtional_notes_manager;
public difficulties_employees;
public difficulties_manager;
public key_facts_employee;
public key_facts_manager;
public objectif3_employee;
public satisfaction_employee;
public tempId;
public appraisalsList =[];
public EvaluatorInfos;

public objectif1_employee_status;
public objectif2_employee_status;
public objectif3_employee_status;





activityForm: FormGroup;
satisfactionForm: FormGroup;
objectivesForm: FormGroup;
additionalForm: FormGroup;


  constructor(private route:ActivatedRoute,
              private appraisalService:AppraisalsService,
              private tokenStorage: TokenStorageService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private userService:UsersService

  ) { }
  ngOnInit() {
    this.currentuser = this.tokenStorage.getUser();
    this.getAppraisals();
    this.isManager();
    this.isEmployee();
    this.activityForm = this.formBuilder.group({
      managerAccomplishement: [{value:'' , disabled: this.isEmployee() },[Validators.required]],
      employeeAccomplishement: [{value:'' , disabled: this.isManager()},[Validators.required]],
      managerEvents: [{value:'' , disabled: this.isEmployee() }, [Validators.required]],
      managerDifficulties: [{value:'' , disabled: this.isEmployee() }, [Validators.required]],
      employeeDifficulties: [{value:'' , disabled: this.isManager() }, [Validators.required]],
      employeeEvents: [{value:'' , disabled: this.isManager() }, [Validators.required]],
    });

    this.satisfactionForm = this.formBuilder.group({

      employeeSatisfaction: [{value:'' , disabled: this.isManager() },[Validators.required]],
      explication_employee: [{value:'' , disabled: this.isManager() },[Validators.required]],


    });
    this.additionalForm = this.formBuilder.group({

      employeeadditional: [{value:'' , disabled: this.isManager() }, [Validators.required]],
      manageradditional: [{value:'' , disabled: this.isEmployee() }, [Validators.required]],


    });


    this.objectivesForm = this.formBuilder.group({

      objectif1: [{value:'' , disabled: this.isManager() }, [Validators.required]],
      objectif2: [{value:'' , disabled: this.isManager() }, [Validators.required]],
      objectif3: [{value:'' , disabled: this.isManager() }, [Validators.required]],

    });





    this.route.params
      .pipe(
        map((_id) => {
          this.appraisalId = _id.id;
        }),
        mergeMap(() => this.appraisalService.getAllAppraisals())
      )
      .subscribe((data) => {
        this.appraisals = data;
        this.appraisal = this.appraisals.filter(
          (client) => client._id == this.appraisalId
        );
        this.user_name = this.appraisal[0].user_name;
        this.user_id = this.appraisal[0].user_id;
        this.previous_date = this.appraisal[0].previous_date;
        this.Next_date = this.appraisal[0].Next_date;
        this.Hire_date = this.appraisal[0].Hire_date;
        this.employee_accomplishement = this.appraisal[0].employee_accomplishement;
        this.manager_accomplishement = this.appraisal[0].manager_accomplishement;
      this.objectif1_employee = this.appraisal[0].objectif1_employee;
      this.objectif2_employee = this.appraisal[0].objectif2_employee;
      this.addtional_notes_employee = this.appraisal[0].addtional_notes_employee;
      this.addtional_notes_manager = this.appraisal[0].addtional_notes_manager;
      this.difficulties_employees = this.appraisal[0].difficulties_employees;
      this.difficulties_manager = this.appraisal[0].difficulties_manager;
      this.key_facts_employee = this.appraisal[0].key_facts_employee;
      this.key_facts_manager = this.appraisal[0].key_facts_manager;
      this.objectif3_employee = this.appraisal[0].objectif3_employee;
      this.satisfaction_employee = this.appraisal[0].satisfaction_employee;
      this.objectif1_employee_status = this.appraisal[0].objectif1_status;
      this.objectif2_employee_status = this.appraisal[0].objectif2_status;
      this.objectif3_employee_status = this.appraisal[0].objectif3_status;
      console.log(this.objectif2_employee_status)
        this.activityForm.setValue({
          managerAccomplishement: this.appraisal[0].manager_accomplishement,
          employeeAccomplishement: this.appraisal[0].employee_accomplishement,
          managerEvents: this.appraisal[0].key_facts_manager,
          managerDifficulties: this.appraisal[0].difficulties_manager,
          employeeDifficulties: this.appraisal[0].difficulties_employees,
          employeeEvents: this.appraisal[0].key_facts_employee
        })

        this.satisfactionForm.setValue({
          employeeSatisfaction: this.appraisal[0].satisfaction_employee,
          explication_employee: this.appraisal[0].employee_accomplishement,
        })

        this.satisfactionForm.setValue({
          employeeSatisfaction: this.appraisal[0].satisfaction_employee,
          explication_employee: this.appraisal[0].explication_employee,
        })

        this.objectivesForm.setValue({
          objectif1: this.appraisal[0].objectif1_employee,
          objectif2: this.appraisal[0].objectif2_employee,
          objectif3: this.appraisal[0].objectif3_employee,

        })

        this.additionalForm.setValue({
          employeeadditional: this.appraisal[0].addtional_notes_employee,
          manageradditional: this.appraisal[0].addtional_notes_manager,

        })

      });
    this.getEvaluator(this.appraisalId)
  }


  employeeAccomplishementisappraisalr(){
    return this.currentuser.role == 'SaaS';
  }

  isEmployee(){
     return this.currentuser?.role != 'Service Manager';
  }

  isManager(){
    return this.currentuser?.role == 'Service Manager';
  }

  getYearDiffWithMonth() {
    let endDate = new Date;
    let startDate = new Date(this.currentuser?.Hire_date)
    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return Math.abs(date.getUTCFullYear() - 1970);
  }

  getYearDiffWithMonthManager() {
    let endDate = new Date;
    let startDate = new Date(this.EvaluatorInfos?.Hire_date)
    const ms = endDate.getTime() - startDate.getTime();

    const date = new Date(ms);

    return Math.abs(date.getUTCFullYear() - 1970);
  }


  public updateAppraisal(){

    let updatedAppraisal = {
      manager_accomplishement: this.activityForm.value.managerAccomplishement,
      key_facts_manager: this.activityForm.value.managerEvents,
      difficulties_manager:this.activityForm.value.managerDifficulties,
      employee_accomplishement: this.activityForm.value.employeeAccomplishement,
      key_facts_employee: this.activityForm.value.employeeEvents,
      difficulties_employees:this.activityForm.value.employeeDifficulties,
      satisfaction_employee:this.satisfactionForm.value.employeeSatisfaction,
      explication_employee:this.satisfactionForm.value.explication_employee,
      objectif1_employee:this.objectivesForm.value.objectif1,
      objectif2_employee:this.objectivesForm.value.objectif2,
      objectif3_employee:this.objectivesForm.value.objectif3,
      addtional_notes_employee:this.additionalForm.value.employeeadditional,
      addtional_notes_manager:this.additionalForm.value.manageradditional,

    };
    this.appraisalService.updateAppraisal(updatedAppraisal, this.appraisalId).subscribe((data)=>
    {
      this.toastr.success('Your Appraisal has been updated', 'Success');
    });
  }

  public getAppraisals(){
    this.appraisalService.getAllAppraisals().subscribe((data)=>{
      this.appraisalsList = data;
      console.log(this.appraisalsList)
    })
  }



  getEvaluator(id){
    this.appraisalService.getAppraisalEvaluator(id).subscribe((data)=>{
      this.EvaluatorInfos = data;
      console.log(this.EvaluatorInfos)
    })
    }


  confirmObjective1(){
    let data = {
      objectif1_status: "Confirmed"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#modal_objective1').modal('hide');
    })
  }


  confirmObjective2(){
    let data = {
      objectif2_status: "Confirmed"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#approve_leave').modal('hide');
      $('#modal_objective2').modal('hide');

    })
  }

  confirmObjective3(){
    let data = {
      objectif3_status: "Confirmed"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#modal_objective3').modal('hide');
    })
  }

  refuseObjective1(){
    let data = {
      objectif1_status: "Refused"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#modal_refuse_objective1').modal('hide');
    })
  }

  refuseObjective2(){
    let data = {
      objectif2_status: "Refused"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#modal_refuse_objective2').modal('hide');
    })
  }

  refuseObjective3(){
    let data = {
      objectif3_status: "Refused"
    }
    this.appraisalService.updateAppraisal(data,this.appraisalId).subscribe((data)=>{
      this.toastr.success("Objective Confirmed Successfully","success");
      $('#modal_refuse_objective3').modal('hide');
    })
  }


}
