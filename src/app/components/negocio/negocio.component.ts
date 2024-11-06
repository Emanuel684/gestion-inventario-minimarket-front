import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosService } from '../../services/productos.services'
import { LocalStorageService } from 'angular-web-storage'

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
