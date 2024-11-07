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

  async postProducto(producto: any, imagen: any) {
    var base = {
      fecha_actualizacion: '2024-11-01T00:00:00',
      fecha_creacion: '2024-11-01T00:00:00',
      imagen: imagen,
      id: '662d0d325363bbc93a0c0295',
    }
    var bodyU = Object.assign({}, base, producto)
    var complemento: String = 'crear-producto'

    var response = {}
    response = await this.http
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
      .toPromise()

    return response
  }

  async getProductoById(identificador: string) {
    var complemento: String = 'producto-identificador'

    var resultado = await this.http
      .get(`${this.baseUrl}/${complemento}/${identificador}`)
      .pipe(
        catchError((error: any, caught: Observable<any>): Observable<any> => {
          // this.errorMessage = error.message;
          console.error('There was an error!', error)

          // after handling error, return a new observable
          // that doesn't emit any values and completes
          return of()
        }),
      )
      .toPromise()

    return resultado
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
      })

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
