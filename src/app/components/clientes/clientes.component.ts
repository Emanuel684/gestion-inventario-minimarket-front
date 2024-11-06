import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { UsuariosService } from '../../services/usuarios.services'

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
  host: { ngSkipHydration: 'true' },
})
export class ClientesComponent implements OnInit {
  title = 'Cliente'
  respuesta_clientes: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [{}],
  }

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.respuesta_clientes = this.usuariosService.getUsuariosTienda()
  }
}
