import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../register/user.service';
import {WebStorage} from '../../core/storage/web.storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginform: FormGroup;
  public subscription: Subscription;
  public Toggledata = true;

  constructor(private storage: WebStorage, private userservice: UserService, private formBuilder: FormBuilder,) {
  }

  ngOnInit() {
    // Add clients form
    this.loginform = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

  }

  // submit() {
  //   this.storage.Login(this.form.value);
  // }

  iconLogle() {
    this.Toggledata = !this.Toggledata
  }

  //
  // constructor(private _router:Router, private _userService:UserService) {
  // }
  //
  // ngOnInit() {
  // }
  //
  // submit() {
  // }
  //
  // ngOnDestroy() {
  // }
  //
  // iconLogle(){
  //   this.Toggledata = !this.Toggledata
  // }
  //
  login() {
    // console.log(JSON.stringify(this.loginForm.value));
    this.userservice.login(JSON.stringify(this.loginform.value))
      .subscribe((data) => {
        {
          console.log(data);
          console.log("tekhdem");
        }
      });
  }
}
