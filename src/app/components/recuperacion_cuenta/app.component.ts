import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'recuperacion-cuenta',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { ngSkipHydration: 'true' },
})
export class RecuperacionComponent {
  title = 'Recuperacion'
}
