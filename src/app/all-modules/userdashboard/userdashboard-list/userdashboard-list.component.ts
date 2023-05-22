import { Component, OnInit } from '@angular/core';
import {CandidatesServices} from '../../candidates.services';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
declare const $: any;
@Component({
  selector: 'app-userdashboard-list',
  templateUrl: './userdashboard-list.component.html',
  styleUrls: ['./userdashboard-list.component.css']
})
export class UserdashboardListComponent implements OnInit {

  public candidatesData = [];
  public addCandidateForm: FormGroup;
  public candidatesaccepeted = [];
  public candidatesinterview = [];
  public candidatesoffered = [];
  public candidatesrejected = [];
  public candidateoffered = [];
  public rows = [];
  public srch = [];



  constructor(private candidatesService:CandidatesServices,
              private toaster:ToastrService,
              private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  this.getCandidatesontesting();
    this.addCandidateForm = this.formBuilder.group({
      candidateName: ['', [Validators.required]],
      candidatePhone: ['', [Validators.required]],
      candidateLastName: ['', [Validators.required]],
      candidateEmail: ['', [Validators.required]],
      candidateGender: ['', [Validators.required]],
      candidatePassword: ['', [Validators.required]],
      candidateBirthday: ['', [Validators.required]],
      candidateDepartement: ['', [Validators.required]],
    });

    this.getCandidatesoffered();
    this.getCandidatesinterviewing();
    this.getCandidaterejected();
    this.getCandidatesaccepeted();
  }

  public getCandidatesontesting() {

    this.candidatesService.getAllCandidatesinTesting().subscribe((data) => {
      this.candidatesData = data;
      this.rows = this.candidatesData;
      this.srch = [...this.rows];
      console.log(this.candidatesData)
    });
  }

  public onAddCandidate() {
    const newCandidate = {
      name: this.addCandidateForm.value.candidateName,
      last_name: this.addCandidateForm.value.candidateLastName,
      email: this.addCandidateForm.value.candidateEmail,
      password: this.addCandidateForm.value.candidatePassword,
      Birth_date: this.addCandidateForm.value.candidateBirthday,
      departement :this.addCandidateForm.value.candidateDepartement,
      gender: this.addCandidateForm.value.candidateGender,
      phone: this.addCandidateForm.value.candidatePhone,
      test_status:'Selected For tests',
      irt_score:0,
      psy_score:0,
      tech_test:0
    };
    this.candidatesService.addCandidate(newCandidate).subscribe((data) => {
      this.getCandidatesontesting();
      $('#add_candidate').modal('hide');
      this.toaster.success('Candidate is added successfully', 'Success');

    });
  }

  public getCandidatesaccepeted() {

    this.candidatesService.getAllCandidatesinTesting().subscribe((data) => {
      this.candidatesaccepeted = data;
    });
  }

  public getCandidatesinterviewing() {

    this.candidatesService.getAllCandidatesinInterview().subscribe((data) => {
      this.candidatesinterview = data;
    });
  }

  public getCandidatesoffered() {

    this.candidatesService.getAllCandidatesoffered().subscribe((data) => {
      this.candidateoffered = data;
    });
  }


  public getCandidaterejected() {

    this.candidatesService.getAllCandidatesinrejected().subscribe((data) => {
      this.candidatesrejected = data;
    });
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
