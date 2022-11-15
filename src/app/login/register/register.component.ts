import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { WebStorage } from "src/app/core/storage/web.storage";
import { UserService } from "./user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  public isvalidconfirmpassword: boolean = false;
  public subscription: Subscription;
  public CustomControler: any;

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(private _router:Router, private _userService:UserService) { }

  ngOnInit() {}

  submit() {
    // if (this.form.value.password != this.form.value.confirmPassword) {
    //   this.isvalidconfirmpassword = true;
    // } else {
    //   this.isvalidconfirmpassword = false;
    //   this.storage.Createaccount(this.form.value);
    // }
    this.register();
  }

  register(){

    this._userService.register(JSON.stringify(this.form.value))
    .subscribe(
      data=> {console.log(data); this._router.navigate(['/login']);},
      error=>console.error(error)
    )
     // console.log(JSON.stringify(this.form.value));
  }

  ngOnDestroy() {
  }
}
