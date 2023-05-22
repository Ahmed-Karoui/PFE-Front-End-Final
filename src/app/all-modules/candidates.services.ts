import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidatesServices {
  private baseURL = `http://localhost:3000/candidates`
  constructor(private http: HttpClient) { }

  getallCandidates(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates`)
  }

  addCandidate(data: any): Observable<any> {
    return this.http.post(`http://localhost:3000/api/auth/resgistercandidate`, data)
  }

  updateCandidate(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-candidate/${id}`, data)
  }

  deleteAppraisal(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-candidate/${id}`)
  }

  confirmCandidate(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/confirm-candidate/${id}`)
  }

  getAllCandidatesinTesting(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates-testing`)
  }

  getAllCandidatesinInterview(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates-interviewing`)
  }

  getAllCandidatesoffered(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates-offered`)
  }

  getAllCandidatesaccepeted(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates-accepted`)
  }

  getAllCandidatesinrejected(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-candidates-rejected`)
  }
}
