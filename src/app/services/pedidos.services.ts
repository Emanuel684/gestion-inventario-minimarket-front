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

  postPedido() {
    console.log('postPedido')

    var bodyU = {
      direccion: 'UNDER DECOMMISSIONING',
      fecha_actualizacion: '1966-04-28T00:00:00',
      fecha_creacion: '1966-04-28T00:00:00',
      fecha_entrega: '1966-04-28T00:00:00',
      id: '662d0d325363bbc93a0c0295',
      id_cliente: '662d0d325363bbc93a0c0295',
      id_tienda: '662d0d325363bbc93a0c0295',
      precio_total: 700,
      productos: ['662d0d325363bbc93a0c0295', '662d0d325363bbc93a0c0295'],
    }

    var complemento: String = 'crear-pedido'
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
