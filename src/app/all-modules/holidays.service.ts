import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolydaysService {

  constructor(private http: HttpClient) {
  }
  getnextHoldays(): Observable<any> {
    return this.http.get(`https://date.nager.at/api/v3/NextPublicHolidays/tn`)
  }
}
