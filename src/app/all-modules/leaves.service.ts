import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {
  private baseURL = `http://localhost:3000/leaves`
  constructor(private http: HttpClient) { }

  getAllLeaves(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-leaves`)
  }

  addLeave(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add-leave`, data)
  }

  updateLeave(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-leave/${id}`, data)
  }

  deleteLeave(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-leave/${id}`)
  }

  getAllUnvalidatedLeaves(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-unvalidated-Leaves`)
  }

  validateLeave(id: any): Observable<any> {
    return this.http.post(`${this.baseURL}/validate-leave/${id}`, id)
  }

  rejectLeave(id: any): Observable<any> {
    return this.http.post(`${this.baseURL}/reject-leave/${id}`,id)
  }

  getUersForLeave(id: string): Observable<any> {
    return this.http.get(`${this.baseURL}/get-user-leave-informations/${id}`)
  }

}
