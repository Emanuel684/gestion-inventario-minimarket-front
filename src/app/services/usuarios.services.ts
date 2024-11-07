import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { catchError, Observable, of } from 'rxjs'
import { environment } from '../../environments/environment'
import { CourseCategory } from '../models/category'
import { LocalStorageService } from 'angular-web-storage'

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = `${environment.apiUrl}/usuarios`

  constructor(
    private http: HttpClient,
    private local: LocalStorageService,
  ) {}

  postUsuario() {
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

    var response = {}

    this.http
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
        response = data
      })

    return response
  }

  KEY = 'value'
  value: any = null

  async getUsuario(formualario: any) {
    this.local.set(this.KEY, { a: 1, now: +new Date() }, 20, 's')

    var complemento: String = 'iniciar-sesion'
    var email = 'emanuelacag@gmail.com'

    var resultado = await this.http
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
      .toPromise()

    this.local.set(
      'login_data',
      { validation: true, data_user: resultado },
      20,
      's',
    )
    if (resultado['password'] == formualario.password) {
      this.local.set('login', { validation: true }, 20, 's')
    }

    return resultado
  }

  async getTenderoInfo() {
    var complemento: String = 'iniciar-sesion'
    var email = 'carlosacag@gmail.com'

    var resultado = await this.http
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
      .toPromise()

    return resultado
  }

  getUsuariosTienda() {
    var complemento: String = 'all-usuarios'
    var email: String = 'carlosacag@gmail.com'
    var response

    this.http
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
      })
    return response
  }

  putTienda(): Observable<CourseCategory[]> {
    var complemento: String = ''
    return this.http.get<CourseCategory[]>(`${this.baseUrl}/${complemento}`)
  }
}
