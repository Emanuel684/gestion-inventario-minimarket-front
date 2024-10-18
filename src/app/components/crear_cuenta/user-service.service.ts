// import { Injectable } from '@angular/core'
import { HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'

// @Injectable({
//   providedIn: 'root',
// })
// export class UserServiceService {
//   private apiUrl = 'https://api.example.com/users' // Replace with your API endpoint

//   constructor(private http: HttpClient) {}

//   fetchUsers(): Observable<any[]> {
//     return this.http.get<any[]>(this.apiUrl)
//   }

//   createUser(user: any): Observable<any> {
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
//     return this.http.post<any>(this.apiUrl, user, { headers })
//   }

//   deleteUser(userId: number): Observable<any> {
//     return this.http.delete<any>(`${this.apiUrl}/${userId}`)
//   }
// }

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private apiUrl = 'https://api.example.com/users' // Replace with your API endpoint

  // constructor(private http: HttpClient) {}
  constructor() {
    console.log('this')
  }

  fetchUsers() {
    console.log('this')
    return []
  }

  // createUser(user: any): Observable<any> {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' })
  //   return this.http.post<any>(this.apiUrl, user, { headers })
  // }

  // deleteUser(userId: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/${userId}`)
  // }
}
// export class ConfigService {
//   // constructor(private http: HttpClient) {
//   //   // This service can now make HTTP requests via `this.http`.
//   // }
// }
