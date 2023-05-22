import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { WebStorage } from "src/app/core/storage/web.storage";
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UsersService} from '../../all-modules/users.service';

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.css"],
})
export class ForgotComponent implements OnInit {
  email: string;
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  public CustomControler: any;
  public subscription: Subscription;

  constructor(private storage: WebStorage,private http: HttpClient,private toast:ToastrService,private userService:UsersService) { }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {}
    resetPassword() {
      let payload = { email: this.form.value.email };
      this.userService.resetPassword(payload).subscribe((data)=>{
        this.toast.success("Reset Email Have been Sent Successfully","Success");
      });

    }
}
