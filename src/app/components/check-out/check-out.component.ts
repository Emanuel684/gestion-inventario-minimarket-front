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

  total_compras = '0'

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

    var total_p = 0

    for (const property of this.respuesta_clientes['data']) {
      console.log(`${property}`)
      total_p = total_p + parseInt(property['precio'])
    }

    this.total_compras = total_p.toString()
    console.log('this.respuesta_clientes: ', this.respuesta_clientes)
  }

  deleteProducto(evento: any): void {
    console.log('deleteProducto: ', this.respuesta_clientes)
    const result = this.respuesta_clientes['data'].filter(
      (item: any) => item.id != evento.id,
    )

    if (result.length == 0) {
      console.log('Field is updated!')
      console.log('result: no find ', result)
    } else if (result.length == 1) {
      console.log('result: find', result)
      // this.productos_carrito.push(evento)

      // const myArray = [1, 2, 3, 4, 5];

      function removeValue(value: any, index: any, arr: any) {
        // If the value at the current array index matches the specified value (2)
        if (value === result) {
          // Removes the value from the original array
          arr.splice(index, 1)
          return true
        }
        return false
      }

      // Pass the removeValue function into the filter function to return the specified value
      const x = this.respuesta_clientes['data'].filter(removeValue)

      // console.log(`myArray values: ${myArray}`);
      console.log(`variable x value: ${x}`)
    } else {
      console.log('result: more that 1', result)
    }

    console.log(this.respuesta_clientes)

    this.local.set(
      'productos_usuario',
      { data: this.respuesta_clientes },
      20,
      's',
    )
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
