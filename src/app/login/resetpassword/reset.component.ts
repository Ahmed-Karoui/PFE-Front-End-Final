import { Component, OnInit } from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Subscription } from "rxjs";
import { WebStorage } from "src/app/core/storage/web.storage";
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { ConfirmPasswordValidator } from './confirm-password.validator';

@Component({
  selector: "app-reset",
  templateUrl: "./reset.component.html",
  styleUrls: ["./reset.component.css"],
})
export class ResetComponent implements OnInit {
  password: string;
  resetPasswordToken: string;
  submitted: boolean = false;

  form = new FormGroup({
    password: new FormControl("", [Validators.required]),
    confirmpassowrd:new FormControl("", [Validators.required]),
  });
  public CustomControler: any;
  public subscription: Subscription;

  constructor(private storage: WebStorage,private http: HttpClient, private activatedRoute: ActivatedRoute,private toast:ToastrService,private router:Router,private fb: FormBuilder) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resetPasswordToken = params['resetPasswordToken'];
      console.log(this.resetPasswordToken)
    });
  }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {
    this.form = this.fb.group(
      {
        password: ["",Validators.required],
        confirmpassowrd: ["",Validators.required]
      },
      {
        validator: ConfirmPasswordValidator("password", "confirmpassowrd")
      }
    );
    let resetPasswordToken = this.activatedRoute.params.subscribe(params => {
      console.log(params.resetPasswordToken);
    })
  }

  submit() {
    this.CustomControler = 0;
    this.storage.Forgotpassword(this.form.value);
  }

  updatePassword() {
    this.submitted = true;
    const url = 'http://localhost:3000/users/update-password';
    let resetPasswordToken = this.activatedRoute.params.subscribe(params => {
      console.log(params.resetPasswordToken);
      const payload = {
        password: this.form.value.password,
        resetPasswordToken: params.resetPasswordToken,
      };
      this.http.post(url, payload).subscribe((response) => {
        this.toast.success("Reset Email Have been Sent Successfully","Success");

      });
    })

  }
}
