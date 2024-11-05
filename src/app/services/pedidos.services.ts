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

  postPedido(formValues: any) {
    console.log('postPedido')

    var bodyU = {
      direccion: 'UNDER DECOMMISSIONING',
      fecha_actualizacion: '1966-04-28T00:00:00',
      fecha_creacion: '1966-04-28T00:00:00',
      fecha_entrega: '1966-04-28T00:00:00',
      id: '662d0d325363bbc93a0c0295',
      id_cliente: '662d0d325363bbc93a0c0295',
      id_tienda: '662d0d325363bbc93a0c0295',
      precio_total: '700',
      productos: '662d0d325363bbc93a0c0295,662d0d325363bbc93a0c0295',
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

  putTienda(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
}
