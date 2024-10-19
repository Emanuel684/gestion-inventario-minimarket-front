import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-recuperacion-cuenta',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './recuperacion-cuenta.component.html',
  styleUrl: './recuperacion-cuenta.component.css',
  host: { ngSkipHydration: 'true' },
})
export class RecuperacionComponent {
  title = 'Recuperacion'
}
