import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, Observable, of } from 'rxjs'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { url } from 'inspector'

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = `${environment.apiUrl}/usuarios`

  constructor(private http: HttpClient) {}

  postUsuario() {
    console.log('postUsuario')
    var complemento: String = 'crear-cuenta'
    var bodyU = {
      ciudad: 'Medellín',
      email: 'emanuelacag@gmail.com',
      fecha_actualizacion: '1966-04-28T00:00:00',
      fecha_creacion: '1966-04-28T00:00:00',
      id: '662d0d325363bbc93a0c0295',
      nombre_completo: 'Emanuel Acevedo',
      pais: 'Colombia',
      tipo: 'cliente',
    }
    console.log(
      '`${this.baseUrl}/${complemento}`: ',
      `${this.baseUrl}/${complemento}`,
    )
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
        console.log('data.id: ', data.id)
      })

    console.log('result: ', result)
    return result
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
