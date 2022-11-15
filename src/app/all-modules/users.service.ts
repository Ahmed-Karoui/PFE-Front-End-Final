import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseURL = `http://localhost:3000/users`
  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-user`)
  }

  addUser(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/signup`, data)
  }

  updateUser(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-user/${id}`, data)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-user/${id}`)
  }
}
