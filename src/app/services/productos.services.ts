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

  postProducto(producto: any) {
    console.log(producto)

    var base = {
      fecha_actualizacion: '2024-11-01T00:00:00',
      fecha_creacion: '2024-11-01T00:00:00',
      id: '662d0d325363bbc93a0c0295',
    }
    var bodyU = Object.assign({}, base, producto)

    var complemento: String = 'crear-producto'
    // var bodyU = {
    //   fecha_actualizacion: "2024-11-01T00:00:00",
    //   fecha_creacion: "2024-11-01T00:00:00",
    //   id: "662d0d325363bbc93a0c0295",
    //   imagen: "https://seeklogo.com/images/M/mini-market-logo-BF4A1CB5E0-seeklogo.com.png",
    //   nombre: "Quesito Costeño",
    //   precio: "11000",
    //   sub_tipo: "Leche",
    //   tipo: "Lacteo"
    // }

    var response = {}

    var result = this.http
      .post(`${this.baseUrl}/${complemento}`, bodyU)
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
        // this.postId = data.id;
        response = data
        console.log('data: ', data)
      })

    console.log('result: ', result)
    console.log('response: ', response)
    return response
  }

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
