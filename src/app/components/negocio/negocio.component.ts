import {
  CommonModule,
  // formatCurrency
} from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  // FormBuilder,
  // FormGroup,
  FormsModule,
  ReactiveFormsModule,
  // Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
// import { ToastrService } from 'ngx-toastr';
// import { UsuariosService } from '../../services/usuarios.services'
import { ProductosService } from '../../services/productos.services'
import { LocalStorageService, SessionStorageService } from 'angular-web-storage'

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './negocio.component.html',
  styleUrl: './negocio.component.css',
  host: { ngSkipHydration: 'true' },
})
export class NegocioComponent implements OnInit {
  title = 'Negocio'
  productos_carrito: any = []

  productos: any = {}

  parentMessage = 'Message from Parent'

  constructor(
    private productosService: ProductosService,
    private local: LocalStorageService,
    private session: SessionStorageService,
  ) {}

  addProducto(evento: any): void {
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

    this.productos_carrito.push(evento)

    this.local.set(
      'productos_usuario',
      { data: this.productos_carrito },
      20,
      's',
    )
  }

  ngOnInit(): void {
    this.productos = this.productosService.getAllProductos()
  }
}
