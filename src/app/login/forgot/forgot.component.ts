import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { WebStorage } from "src/app/core/storage/web.storage";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.component.html",
  styleUrls: ["./forgot.component.css"],
})
export class ForgotComponent implements OnInit {
  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  public CustomControler: any;
  public subscription: Subscription;

  constructor(private storage: WebStorage) { }
  get f() {
    return this.form.controls;
  }
  ngOnInit() {}
  submit() {
    this.CustomControler = 0;
    this.storage.Forgotpassword(this.form.value);
  }
}
