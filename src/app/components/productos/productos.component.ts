import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosService } from '../../services/productos.services'
import {
  LocalStorageService,
  SessionStorageService,
  LocalStorage,
  SessionStorage,
} from 'angular-web-storage'

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  host: { ngSkipHydration: 'true' },
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductosComponent implements OnInit {
  title = 'Prodcutos'

  productos_carrito: any = []

  productos: any = {}

  parentMessage = 'Message from Parent'

  constructor(
    private productosService: ProductosService,
    private local: LocalStorageService,
    private session: SessionStorageService,
  ) {}

  addProducto(evento: any): void {
    const result = this.productos_carrito.filter(
      (item: any) => item.id == evento.id,
    )
    console.log('result: ', result)

    if (result.length == 0) {
      console.log('Field is updated!')
      evento.cantidad = 1
      console.log(evento)
      this.productos_carrito.push(evento)
    } else {
      console.log('result1: ', result[0])
      evento.cantidad = result[0].cantidad + 1
      console.log(evento)
      this.productos_carrito.push()
    }

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
