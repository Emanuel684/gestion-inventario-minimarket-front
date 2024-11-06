import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosService } from '../../services/productos.services'

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  host: { ngSkipHydration: 'true' },
})
export class InventarioComponent implements OnInit {
  title = 'Inventario'

  productos: any = {}

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.productos = this.productosService.getAllProductos()
  }
}
