import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private baseURL = `http://localhost:3000/tickets`
  constructor(private http: HttpClient) { }

  getAllTickets(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-tickets`)
  }

  addTicket(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add-ticket`, data)
  }

  updateTicket(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-ticket/${id}`, data)
  }

  deleteTicket(id: any): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-ticket/${id}`)
  }
}
