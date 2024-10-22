import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { UsuariosService } from '../../services/usuarios.services'
import { TiendasService } from '../../services/tiendas.services'

@Component({
  selector: 'app-tendero',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './tendero.component.html',
  styleUrl: './tendero.component.css',
  host: { ngSkipHydration: 'true' },
})
export class TenderoComponent implements OnInit {
  title = 'Tendero'

  constructor(
    private usuariosService: UsuariosService,
    private tiendasService: TiendasService,
  ) {}

  ngOnInit(): void {
    console.log('oninit')
    var result_usuario = this.usuariosService.getTenderoInfo()
    var result_tienda = this.tiendasService.getTiendaInfo()
    console.log('result usuario', result_usuario)
    console.log('result tienda', result_tienda)
    // this.userId = this.loginService.userId;
  }
}
