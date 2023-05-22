import { Component, OnInit } from '@angular/core';
import {CandidatesServices} from '../../candidates.services';

@Component({
  selector: 'app-interviewing-list',
  templateUrl: './interviewing-list.component.html',
  styleUrls: ['./interviewing-list.component.css']
})
export class InterviewingListComponent implements OnInit {
  public candidatesaccepeted = [];
  public rows = [];
  public srch = [];

  constructor(private candidatesService:CandidatesServices) { }

  ngOnInit(): void {
    this.getCandidatesaccepeted();
  }


  public getCandidatesaccepeted() {

    this.candidatesService.getAllCandidatesaccepeted().subscribe((data) => {
      this.candidatesaccepeted = data;
      console.log(this.candidatesaccepeted)
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
