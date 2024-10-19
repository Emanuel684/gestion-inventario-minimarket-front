import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-tendero',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './tendero.component.html',
  styleUrl: './tendero.component.css',
  host: { ngSkipHydration: 'true' },
})
export class TenderoComponent {
  title = 'Tendero'
}
