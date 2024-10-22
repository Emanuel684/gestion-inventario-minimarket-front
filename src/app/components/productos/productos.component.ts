import { CommonModule, formatCurrency } from '@angular/common'
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
  selector: 'app-productos',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  host: { ngSkipHydration: 'true' },
})
export class ProductosComponent implements OnInit {
  title = 'Prodcutos'
  contactForm!: FormGroup
  userId = 0
  productos: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [
      {
        id: '6717c43ef963e95aa4789246',
        nombre: 'Leche',
        tipo: 'Lacteo',
        sub_tipo: 'Leche',
        precio: '5500',
        fecha_creacion: '2024-10-22T00:00:00',
        fecha_actualizacion: '2024-10-22T00:00:00',
      },
    ],
  }

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
  ) {
    this.contactForm = this.fb.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    console.log('oninit Productos')
    var result = this.productosService.getAllProductos()
    this.productos = result
    console.log('result Productos: ', result)
    // this.userId = this.loginService.userId;
  }

  // onSubmit() {
  //   if (this.contactForm.valid) {
  //     console.log(this.contactForm.value)
  //     this.usuariosService.getUsuario()
  //     // this.contactService.sendMessage(this.contactForm.value).subscribe(
  //     //   (response) => {
  //     //     this.toastrService.success('Message sent successfully!');
  //     //     this.contactForm.reset(); // Reset form after submission
  //     //   },
  //     //   (error) => {
  //     //     this.toastrService.error('Error sending message. Please try again.');
  //     //   }
  //     // );
  //   }
  // }
}
