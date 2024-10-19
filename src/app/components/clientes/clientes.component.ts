import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
  host: { ngSkipHydration: 'true' },
})
export class ClientesComponent {
  title = 'Cliente'
}
