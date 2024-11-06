import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { catchError, Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class TiendasService {
  private baseUrl = `${environment.apiUrl}/tiendas`

  constructor(private http: HttpClient) {}

  getTiendaInfo() {
    var complemento: String = 'tienda-identificador'
    var email = '6717c09a4f00c9c785619f29'
    var response

    this.http
      .get(`${this.baseUrl}/${complemento}/${email}`)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          // this.errorMessage = error.message;
          console.error('There was an error!', error)

          // after handling error, return a new observable
          // that doesn't emit any values and completes
          return of()
        }),
      )
      .subscribe((data) => {
        response = data
      })

    return response
  }

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
