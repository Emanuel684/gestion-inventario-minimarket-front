import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private baseUrl = `${environment.apiUrl}/productos`

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CourseCategory[]> {
    return this.http.get<CourseCategory[]>(`${this.baseUrl}`)
  }
  postTienda(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
  putTienda(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
}
