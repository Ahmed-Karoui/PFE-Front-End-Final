import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from './header.service';
import {TokenStorageService} from '../login/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  jsonData: any = {
    notification: [],
    message: [],
  };
  notifications: any;
  messagesData: any;
  currentuser:any;
  isLoggedIn = false;


  constructor(private headerService: HeaderService, private router: Router,private tokenStorage: TokenStorageService) {}

  ngOnInit() {
    // this.getDatas("notification");
    // this.getDatas("message");
    this.currentuser = this.tokenStorage.getUser();
    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorage.getUser();
    }
    else {
      this.router.navigate(['/login']);
    }

    this.notifications = [
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '4 mins ago',
      },
      {
        message: 'Patient appointment booking',
        author: 'John Doe',
        function: 'added new task',
        time: '1 hour ago',
      },
    ];

    this.messagesData = [
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '4 mins ago',
      },
      {
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
        author: 'Mike Litorus',
        time: '1 hour ago',
      },
    ];
  }

  getDatas(section) {
    this.headerService.getDataFromJson(section).subscribe((data) => {
      this.jsonData[section] = data;
    });
  }

  clearData(section) {
    this.jsonData[section] = [];
  }
  onSubmit() {
    this.router.navigate(['/pages/search']);
  }

  logout(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
