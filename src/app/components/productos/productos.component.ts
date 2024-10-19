import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
  host: { ngSkipHydration: 'true' },
})
export class ProductosComponent {
  title = 'Prodcutos'
}
