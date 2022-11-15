import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private baseURL = `http://localhost:3000/tasks`
  constructor(private http: HttpClient) { }

  getAllTasks(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-tasks`)
  }

  addTask(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add-task`, data)
  }

  updateTask(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-task/${id}`, data)
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-task/${id}`)
  }
}
