import { Component, OnInit } from '@angular/core';
import {map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {CandidatesServices} from '../../candidates.services';
import {ToastrService} from 'ngx-toastr';
declare const $: any;


@Component({
  selector: 'app-job-details-interview',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsInterviewComponent implements OnInit {
candidateId : any;
candidates = [];
candidate : any;
  name:any;
  email: any;
  last_name: any;
  Birth_date: any;
  gender:any;
  tests_status:any;
  departement:any;
  irt_score:any;
  psy_score:any;
  tech_test:any;
  phone:any;
  creation_date:any;
  status:any;

              constructor(private route: ActivatedRoute,
              private candidateService:CandidatesServices,
                          private toaster:ToastrService,
                          private router:Router) { }

  ngOnInit() {
    this.route.params
      .pipe(
        map((_id) => {
          this.candidateId = _id.id;
        }),
        mergeMap(() => this.candidateService.getallCandidates())
      )
      .subscribe((data) => {
        this.candidates = data;
        this.candidate = this.candidates.filter(
          (client) => client._id == this.candidateId
        );
        this.name = this.candidate[0].name;
        this.email = this.candidate[0].email;
        this.last_name = this.candidate[0].last_name;
        this.Birth_date = this.candidate[0].Birth_date;
        this.gender = this.candidate[0].gender;
        this.tests_status = this.candidate[0].test_status;
        this.departement = this.candidate[0].departement;
        this.irt_score = this.candidate[0].irt_score;
        this.psy_score = this.candidate[0].psy_score;
        this.tech_test = this.candidate[0].tech_test;
        this.phone = this.candidate[0].phone;
        this.creation_date = this.candidate[0].creation_date;
        this.status = this.candidate[0].status;

      });
  }


  updateCandidate(){
    let data = {
      status: "offered"
    }
    this.candidateService.updateCandidate(data,this.candidateId).subscribe((data)=>{
      this.toaster.success("Objective Confirmed Successfully","success");
      $('#interviewing_candidate').modal('hide');
      this.router.navigate(['/layout/appliedjobs/applied-jobs'])
    })
  }


  rejectCandidate(){
    let data = {
      status: "rejected"
    }
    this.candidateService.updateCandidate(data,this.candidateId).subscribe((data)=>{
      this.toaster.success("Objective Confirmed Successfully","success");
      $('#interviewing_candidate').modal('hide');
      this.router.navigate(['/layout/offeredjobs/offered-jobs'])
    })
  }


}
