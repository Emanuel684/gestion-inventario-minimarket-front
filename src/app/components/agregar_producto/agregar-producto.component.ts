import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosService } from '../../services/productos.services'

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css',
  host: { ngSkipHydration: 'true' },
})
export class AgregarProductoComponent implements OnInit {
  title: string = 'Agregar producto'
  contactForm!: FormGroup
  userId = 0
  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', [Validators.required]],
      sub_tipo: ['', Validators.required],
      precio: ['', Validators.required],
      imagen: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.productosService.postProducto(this.contactForm.value)
    }
  }
}
