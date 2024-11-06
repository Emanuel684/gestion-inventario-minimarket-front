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
import { UsuariosService } from '../../services/usuarios.services'
import { ProductosComponent } from '../productos/productos.component'
import { PedidosService } from '../../services/pedidos.services'
import {
  LocalStorageService,
  SessionStorageService,
  // LocalStorage,
  // SessionStorage,
} from 'angular-web-storage'

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ProductosComponent,
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
  host: { ngSkipHydration: 'true' },
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class PedidosComponent implements OnInit {
  contactForm!: FormGroup
  title = 'Pedidos'

  total_compras = '0'

  resultados_pedidos: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [
      {
        id: '672a9266687e378ff111c27d',
        id_tienda: '662d0d325363bbc93a0c0295',
        id_cliente: '662d0d325363bbc93a0c0295',
        productos: '662d0d325363bbc93a0c0295,662d0d325363bbc93a0c0295',
        precio_total: '700',
        direccion: 'UNDER DECOMMISSIONING',
        fecha_entrega: '1966-04-28T00:00:00',
        fecha_creacion: '1966-04-28T00:00:00',
        fecha_actualizacion: '1966-04-28T00:00:00',
      },
    ],
  }

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private pedidosService: PedidosService,
    private local: LocalStorageService,
    private session: SessionStorageService,
  ) {
    this.contactForm = this.fb.group({
      direccion: ['', Validators.required],
      fechaEntrega: ['', [Validators.required]],
    })
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('contactForm: ', this.contactForm)
      // console.log(this.contactForm.value)
      // console.log('onSubmit: ')
      // this.loginService.postUsuario()
      // console.log('result: ', result)
      // this.contactService.sendMessage(this.contactForm.value).subscribe(
      //   (response) => {
      //     this.toastrService.success('Message sent successfully!');
      //     this.contactForm.reset(); // Reset form after submission
      //   },
      //   (error) => {
      //     this.toastrService.error('Error sending message. Please try again.');
      //   }
      // );
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit pedidos')
    // this.calTotal()
    this.resultados_pedidos = this.pedidosService.getAllPedidos()
    console.log('resultados_pedidos: ', this.resultados_pedidos)
  }

  deleteProducto(evento: any): void {
    console.log('deleteProducto: ', evento)

    this.pedidosService.deletePedido(evento)
  }
}
