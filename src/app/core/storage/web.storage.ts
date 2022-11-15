import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebStorage {
  public Loginvalue = new BehaviorSubject<any>(0);
  public Createaccountvalue = new BehaviorSubject<any>(0);
  public Forgotpasswordvalue = new BehaviorSubject<any>(0);
  constructor(private router: Router) {}

  /**
   * Create account Function call from Registerpage
   * @param uservalue from user form value
   */
   public Createaccount(uservalue: any): void {
    let Rawdata = localStorage.getItem('Loginusers');
    let Pdata: any = [];
    Pdata = JSON.parse(Rawdata);
    const Eresult: any = Pdata.find(({ email }) => email === uservalue.email);
      if (Eresult) {
        this.Createaccountvalue.next('This email are already exist');
      } else {
        Pdata.push(uservalue);
        const jsonData = JSON.stringify(Pdata);
        localStorage.setItem('Loginusers', jsonData);
        this.Login(uservalue);
      }
  }

  /**
   * Login Functionality call from Login
   * @param uservalue from login page
   */
  public Login(uservalue: any): void {
    let returndata={message:'',status:''}
    let data = localStorage.getItem('Loginusers');
    let Pdata: [] = JSON.parse(data);
    const Eresult: any = Pdata.find(({ email }) => email === uservalue.email);
    if (Eresult) {
      if (Eresult.password === uservalue.password) {
        this.Createtoken(uservalue);
        this.Loginvalue.next('Login success');
        this.router.navigate(['/layout/dashboard/admin']);
        this.Loginvalue.next(0);
      } else {
        returndata.message='Incorrect password'
        returndata.status='password'
        this.Loginvalue.next(returndata);
      }
    } else {
      returndata.message='Email is  not valid'
      returndata.status='email'
      this.Loginvalue.next(returndata);
    }
  }

  /**
   * Create Token function for authendication
   * @param uservalue recived from login function
   */
  public Createtoken(uservalue) {
    var result = 'ABCDEFGHI' + uservalue.email + 'ghijklmnopqrs' + 'z01234567';
    localStorage.setItem('LoginData', result);
  }

  /**
   * Two Storage are used
   */
  public Deleteuser() {
    localStorage.removeItem('Loginusers');
    localStorage.removeItem('LoginData');
  }

  /**
   * called from Login page init statement
   */
  public Checkuser(): void {
    let users = localStorage.getItem('Loginusers');
    if (users === null) {
      let password = [
        {
          email: 'admin@dreamguys.in',
          password: '123456',
        },
      ];
      const jsonData = JSON.stringify(password);
      localStorage.setItem('Loginusers', jsonData);
    }
  }

  /**
   * Forgot password function
   * @param uservalue email object recived from Forgot password
   */
  public Forgotpassword(uservalue): void {
    let Rawdata = localStorage.getItem('Loginusers');
    let Pdata: any = [];
    Pdata = JSON.parse(Rawdata);
    const Eresult = Pdata.find(({ email }) => email === uservalue.email);
    if (Eresult) {
      this.Forgotpasswordvalue.next(Eresult);
    } else {
      this.Forgotpasswordvalue.next('Email Not Valid');
    }
  }
}
