import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './negocio.component.html',
  styleUrl: './negocio.component.css',
  host: { ngSkipHydration: 'true' },
})
export class NegocioComponent {
  title = 'Negocio'
}
