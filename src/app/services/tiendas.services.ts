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
    var complemento: String = 'iniciar-sesion'
    var email = 'carlosacag@gmail.com'
    var response

    var result = this.http
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
        console.log('data: ', data)
      })

    console.log('result: ', result)
    console.log('response: ', response)
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
