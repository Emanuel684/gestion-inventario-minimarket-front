import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/CourseCategory`

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CourseCategory[]> {
    console.log('getCategories')
    return this.http.get<CourseCategory[]>(`${this.baseUrl}`)
  }
}
