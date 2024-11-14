import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { catchError, Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class InventariosService {
  private baseUrl = `${environment.apiUrl}/inventarios`

  constructor(private http: HttpClient) {}

  async postProductoInventario(id_producto: string, cantidad: string) {
    // Create a new Date object
    const date = new Date()

    // Format the date as "YYYY-MM-DDTHH:mm:ss"
    const formattedDate = date.toISOString().slice(0, 19)

    var base = {
      fecha_actualizacion: formattedDate,
      fecha_creacion: formattedDate,
      id_producto: id_producto,
      id_tienda: '6717c23ae417fc950c08ddae',
      cantidad_disponibles: cantidad,
    }
    // var bodyU = Object.assign({}, base, producto)

    var complemento: String = 'crear-inventario'

    var response = {}
    response = await this.http
      .post(`${this.baseUrl}/${complemento}`, base)
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
