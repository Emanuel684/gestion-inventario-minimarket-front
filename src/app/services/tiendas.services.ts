import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'

@Injectable({
  providedIn: 'root',
})
export class TiendasService {
  private baseUrl = `${environment.apiUrl}/tiendas`

  constructor(private http: HttpClient) {}

  getTiendas(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
  getTiendaById(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
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
