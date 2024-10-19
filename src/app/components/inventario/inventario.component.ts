import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  host: { ngSkipHydration: 'true' },
})
export class InventarioComponent {
  title = 'Inventario'
}
