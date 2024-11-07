import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosComponent } from '../productos/productos.component'
import { PedidosService } from '../../services/pedidos.services'
import { LocalStorageService } from 'angular-web-storage'

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ProductosComponent,
  ],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
  host: { ngSkipHydration: 'true' },
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class CheckOutComponent implements OnInit {
  contactForm!: FormGroup
  title = 'CheckOut'

  total_compras = '0'

  respuesta_clientes: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [{}],
  }

  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private local: LocalStorageService,
  ) {
    this.contactForm = this.fb.group({
      direccion: ['', Validators.required],
      fechaEntrega: ['', [Validators.required]],
    })
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('contactForm: ', this.contactForm.value)
    }
  }

  calTotal() {
    this.respuesta_clientes = this.local.get('productos_usuario')
    console.log('this.respuesta_clientes: ', this.respuesta_clientes)

    var total_p = 0

    for (const property of this.respuesta_clientes?.data) {
      console.log(`${property}`)
      total_p = total_p + parseInt(property['precio'])
    }

    this.total_compras = total_p.toString()
    console.log('this.respuesta_clientes: ', this.respuesta_clientes)

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes?.data },
      20,
      's',
    )
  }

  ngOnInit(): void {
    this.calTotal()

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes?.data },
      20,
      's',
    )
  }

  deleteProducto(evento: any): void {
    const result = this.respuesta_clientes?.data.filter(
      (item: any) => item.id == evento.id,
    )

    if (result.length == 0) {
      console.log('Field is updated!')
    } else {
      function removeValue(value: any, index: any, arr: any) {
        // If the value at the current array index matches the specified value (2)
        if (value == result[0]) {
          // Removes the value from the original array
          arr.splice(index, 1)
          return true
        }
        return false
      }
      const x = this.respuesta_clientes?.data.filter(removeValue)
    }

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes?.data },
      20,
      's',
    )

    // Calculamos la valor todal despues de eliminar un producto
    this.calTotal()
  }

  pagarProductos(): void {
    this.pedidosService.postPedido(
      this.contactForm.value,
      this.total_compras,
      this.respuesta_clientes?.data,
    )

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes },
      20,
      's',
    )
  }
}
