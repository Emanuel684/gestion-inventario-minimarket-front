import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'

import { catchError, Observable, of } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private baseUrl = `${environment.apiUrl}/pedidos`

  constructor(private http: HttpClient) {}

  deletePedido(identificador: any) {
    console.log('deletePedido: ', identificador)

    var complemento: String = 'eliminar-pedido'

    var response = {}

    this.http
      .delete(`${this.baseUrl}/${complemento}/${identificador}`)
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
        console.log('data delete: ', data)
      })

    // result = this.getAllPedidos()

    // console.log('result delete: ', result)
    console.log('response delete: ', response)
    return response
  }

  postPedido(formValues: any, valorTotal: any, productos: any) {
    console.log('postPedido: ', formValues)
    console.log('productos: ', productos)

    var bodyU = {
      direccion: formValues['direccion'],
      fecha_actualizacion: '1966-04-28T00:00:00',
      fecha_creacion: '1966-04-28T00:00:00',
      fecha_entrega: formValues['fechaEntrega'] + 'T00:00:00',
      id: '662d0d325363bbc93a0c0295',
      id_cliente: '662d0d325363bbc93a0c0295',
      id_tienda: '662d0d325363bbc93a0c0295',
      precio_total: valorTotal,
      productos: productos.map((item: { id: any }) => item.id).join(','),
    }

    var complemento: String = 'crear-pedido'

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

  getAllPedidos() {
    var complemento: String = 'pedidos-registrados'
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
        console.log('data: ', data)
      })

    // console.log('result: ', result)
    console.log('response: ', response)
    return response
  }

  putTienda(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
}
