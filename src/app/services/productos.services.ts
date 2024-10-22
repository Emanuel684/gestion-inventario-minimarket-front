import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { catchError, Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private baseUrl = `${environment.apiUrl}/productos`

  constructor(private http: HttpClient) {}

  getAllProductos() {
    var complemento: String = 'productos-registrados'
    var response

    this.http
      .get(`${this.baseUrl}/${complemento}`)
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
        // console.log('data: ', data)
      })

    // console.log('result: ', result)
    // console.log('response: ', response)
    return response
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
