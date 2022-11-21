import { Component, OnInit } from '@angular/core';
import { AllModulesService } from '../../all-modules.service';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-clients-profile',
  templateUrl: './clients-profile.component.html',
  styleUrls: ['./clients-profile.component.css']
})
export class ClientsProfileComponent implements OnInit {
  public allClients = [];
  public client = [];
  public clientId;

  constructor(private allModulesService: AllModulesService,
              private route: ActivatedRoute,
              private userService:UsersService) { }



  ngOnInit() {
    this.route.params.pipe(map(_id => {
      this.clientId = _id.id;
    }), mergeMap(() => this.userService.getAllUsers())).subscribe(data => {
      this.allClients = data;
      this.client = this.allClients.filter(client => client._id == this.clientId);
      console.log((this.client));
    });
  }

}
