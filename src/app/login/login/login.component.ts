import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../register/user.service';
import {WebStorage} from '../../core/storage/web.storage';
import {AuthService} from '../auth.service';
import {TokenStorageService} from '../token-storage.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginform: FormGroup;
  public subscription: Subscription;
  public Toggledata = true;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  currentUser : any ;

  constructor(private storage: WebStorage, private userservice: UserService, private formBuilder: FormBuilder,
              private authService: AuthService,private tokenStorage: TokenStorageService, private router:Router,
              private toast:ToastrService) {
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    // Add clients form
    this.loginform = this.formBuilder.group({
      username: ['', [Validators.required]],
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
    this.authService.login(this.loginform.get('username').value,this.loginform.get('password').value).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.currentUser = this.tokenStorage.getUser();
        console.log(this.currentUser);
        this.router.navigate(['/layout/dashboard/admin']);

      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        if(this.errorMessage == "User Not found.")
        {
          this.toast.error("User Does Not Exit","Error")
        }
        else
        {
          this.toast.warning("Inccorect Password Please Try Again","Error")
        }
      }
    });
  }





}
