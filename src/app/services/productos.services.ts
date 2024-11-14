import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { catchError, Observable, of } from 'rxjs'
import { InventariosService } from './inventarios.services'

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private baseUrl = `${environment.apiUrl}/productos`

  constructor(
    private http: HttpClient,
    private inventariosService: InventariosService,
  ) {}

  async postProducto(producto: any, imagen: any) {
    // Create a new Date object
    const date = new Date()

    // Format the date as "YYYY-MM-DDTHH:mm:ss"
    const formattedDate = date.toISOString().slice(0, 19)

    var bodyU = {
      fecha_actualizacion: formattedDate,
      fecha_creacion: formattedDate,
      imagen: imagen,
      id: '662d0d325363bbc93a0c0295',
      tipo: producto.tipo,
      nombre: producto.nombre,
      sub_tipo: producto.sub_tipo,
      precio: producto.precio,
    }
    // var bodyU = Object.assign({}, base, producto)
    var complemento: String = 'crear-producto'

    var response = {
      data: {
        _id: '',
      },
    }
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
    await this.inventariosService.postProductoInventario(
      response?.data['_id'],
      producto.cantidadProductos,
    )

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
