import { Component, OnInit } from '@angular/core';
import {ProjectsService} from '../../projects.service';
import {LeavesService} from '../../leaves.service';
import {TicketsService} from '../../tickets.service';
import {UserService} from '../../../login/register/user.service';
import {UsersService} from '../../users.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  public nb_Project:any;
  public nb_Projects:any;
  public nb_Employee:any;
  public nb_Employees:any;
  public nb_Leaves:any;
  public nb_Leavess:any;
  public nb_Ticketss:any;
  public nb_Tickets:any;
  public chartData;
  public chartOptions;
  public lineData;
  public lineOption;
  public barColors = {
    a: '#00c5fb',
    b: '#0253cc',
  };
  public lineColors = {
    a: '#00c5fb',
    b: '#0253cc',
  };

  constructor(private serviceProject: ProjectsService,private serviceLeaves:LeavesService,private serviceTicket:TicketsService,private serviceUser:UsersService) { }

  ngOnInit() {
    this.serviceProject.getAllProjects().subscribe((data) => {
      this.nb_Projects = data;
      this.nb_Project = this.nb_Projects.length;
    });
    this.serviceLeaves.getAllLeaves().subscribe((data) => {
      this.nb_Leavess= data;
      this.nb_Leaves = this.nb_Leavess.length;
    });
    this.serviceTicket.getAllTickets().subscribe((data) => {
      this.nb_Ticketss = data;
      this.nb_Tickets = this.nb_Ticketss.length;
    });
    this.serviceUser.getAllUsers().subscribe((data) => {
      this.nb_Employees = data;
      this.nb_Employee = this.nb_Employees.length;
    });
    this.chartOptions = {
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Total Income', 'Total Outcome'],
      barColors: [this.barColors.a, this.barColors.b],
    };

    this.chartData = [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75, b: 65 },
      { y: '2008', a: 50, b: 40 },
      { y: '2009', a: 75, b: 65 },
      { y: '2010', a: 50, b: 40 },
      { y: '2011', a: 75, b: 65 },
      { y: '2012', a: 100, b: 90 },
    ];

    this.lineOption = {
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Total Sales', 'Total Revenue'],
      resize: true,
      lineColors: [this.lineColors.a, this.lineColors.b],
    };

    this.lineData = [
      { y: '2006', a: 50, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 50 }
    ];
  }
}
