import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppraisalsService {
  private baseURL = `http://localhost:3000/appraisals`
  constructor(private http: HttpClient) { }

  getAllAppraisals(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-appraisals`)
  }

  addAppraisal(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add-appraisal`, data)
  }

  updateAppraisal(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-appraisal/${id}`, data)
  }

  deleteAppraisal(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-appraisal/${id}`)
  }
  getAppraisalEvaluator(id: string): Observable<any> {
    return this.http.get(`${this.baseURL}/get-evaluator-informations/${id}`)
  }
}
