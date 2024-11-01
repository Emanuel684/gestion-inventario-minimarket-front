import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { UsuariosService } from '../../services/usuarios.services'
import { ProductosComponent } from '../productos/productos.component'
import {
  LocalStorageService,
  SessionStorageService,
  LocalStorage,
  SessionStorage,
} from 'angular-web-storage'

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
  title = 'CheckOut'

  respuesta_clientes: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [
      {
        id: '6716b4727e2682dc485954a1',
        nombre_completo: 'Emanuel Acevedo',
        email: 'emanuelacag@gmail.com',
        password: 'Ytpgs9m1!',
        pais: 'Colombia',
        ciudad: 'Medellín',
        tipo: 'cliente',
        fecha_creacion: '1966-04-28T00:00:00',
        fecha_actualizacion: '1966-04-28T00:00:00',
      },
      {
        id: '6717c09a4f00c9c785619f29',
        nombre_completo: 'Carlos Acevedo',
        email: 'carlosacag@gmail.com',
        password: 'Ytpgs9m2!',
        pais: 'Colombia',
        ciudad: 'Medellín',
        tipo: 'tendero',
        fecha_creacion: '2024-10-22T00:00:00',
        fecha_actualizacion: '2024-10-22T00:00:00',
      },
    ],
  }

  constructor(
    private usuariosService: UsuariosService,
    private local: LocalStorageService,
    private session: SessionStorageService,
  ) {}

  ngOnInit(): void {
    console.log('productos: ', this.local.get('productos_usuario'))
    // this.respuesta_clientes = this.usuariosService.getUsuariosTienda()
    this.respuesta_clientes = this.local.get('productos_usuario')
    console.log('this.respuesta_clientes: ', this.respuesta_clientes)
  }

  addProducto(): void {
    // const result = this.productos_carrito.filter(
    //   (item: any) => item.id == evento.id,
    // )
    // console.log('result: ', result)

    // if (result.length == 0) {
    //   console.log('Field is updated!')
    //   evento.cantidad = 1
    //   console.log(evento)
    //   this.productos_carrito.push(evento)
    // } else {
    //   console.log('result1: ', result[0])
    //   evento.cantidad = result[0].cantidad + 1
    //   console.log(evento)
    //   this.productos_carrito.push()
    // }

    console.log(this.respuesta_clientes)

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes },
      20,
      's',
    )
  }
}
