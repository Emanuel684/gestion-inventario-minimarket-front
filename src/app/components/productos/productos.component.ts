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
import { LocalStorageService } from 'angular-web-storage'

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
  ) {}

  addProducto(evento: any): void {
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
