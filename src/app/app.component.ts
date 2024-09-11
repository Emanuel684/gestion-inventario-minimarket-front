import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CursosService } from './services/cursos.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  closeResult = '';
  public cursos: Array<any> = []
  public form;
  public formEditar;

  constructor(
    private cursosService: CursosService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.form = this.formBuilder.group({
      Name: '',
      Date_start: '',
      Date_end: '',
    });
    this.formEditar = this.formBuilder.group({
      Id: '',
      Name: '',
      Date_start: '',
      Date_end: '',
    });
    this.cursosService.getCursos().subscribe((resp: any) => {
      this.cursos = resp
    });
  }
  open(content: any, cursosID: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete(courseID: any) {
    this.cursosService.deleteCurso(courseID).subscribe((data: any) => {
      this.cursosService.getCursos().subscribe((resp: any) => {
        this.cursos = resp
      });
    })
    this.form.reset();
  }

  editar(customerData: any): void {
    this.cursosService.updateCurso(customerData).subscribe((data: any) => {
      this.cursosService.getCursos().subscribe((resp: any) => {
        this.cursos = resp
      });
    });
    this.form.reset();
  }

  send(customerData: any): void {
    this.cursosService.addCursos(customerData).subscribe((data: any) => {
      this.cursosService.getCursos().subscribe((resp: any) => {
        this.cursos = resp
      });
    });
    this.form.reset();
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
