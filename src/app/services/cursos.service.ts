import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  _url = 'http://127.0.0.1:8000/api/cursos'
  constructor(
    private http:HttpClient,
  ) {
    console.log("Servicio persona"); 
  }
  getCursos(){
    let headers = new HttpHeaders().set('Type-content', 'aplication/json');
    return this.http.get(this._url,  {
      headers: headers
    });
  }

  addCursos(curso: any){
    let headers = new HttpHeaders().set('Type-content', 'aplication/json');
    return this.http.post(this._url, curso,  {
      headers: headers
    });
  }

  updateCurso(curso: any){
    let headers = new HttpHeaders().set('Type-content', 'aplication/json');
    return this.http.put(`http://127.0.0.1:8000/api/cursos/${curso.Id}`, curso, {
      headers: headers
    });
  }

  deleteCurso(id: any){
    let headers = new HttpHeaders().set('Type-content', 'aplication/json');
    return this.http.delete(`http://127.0.0.1:8000/api/cursos/${id}`, {
      headers: headers
    });
  }

}
