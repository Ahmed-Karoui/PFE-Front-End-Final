import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseURL = `http://localhost:3000/projects`
  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any> {
    return this.http.get(`${this.baseURL}/get-projects`)
  }

  addProject(data: any): Observable<any> {
    return this.http.post(`${this.baseURL}/add-project`, data)
  }

  updateProject(data: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/update-project/${id}`, data)
  }

  deleteData(id: string): Observable<any> {
    return this.http.delete(`${this.baseURL}/delete-project/${id}`)
  }

  addUserToProject(member: any, id: string): Observable<any> {
    return this.http.post(`${this.baseURL}/add-user-to-project/${id}`, member)
  }

  addManagerToProject(members: any, id: string): Observable<any> {
    return this.http.patch(`${this.baseURL}/add-manager-to-project/${id}`, members)
  }

  getManagerByTraining(id: string): Observable<any> {
    return this.http.get(`${this.baseURL}/get-manager-informations/${id}`)
  }


  getUsersByProject(id: string): Observable<any> {
    return this.http.get(`${this.baseURL}/get-users-informations/${id}`)
  }


}
