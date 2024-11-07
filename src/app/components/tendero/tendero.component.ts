import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
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
  contactForm!: FormGroup

  resultado_usuario: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: {},
  }
  resultado_tienda: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: {},
  }

  constructor(
    private usuariosService: UsuariosService,
    private tiendasService: TiendasService,
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      pais: ['', Validators.required],
      ciudad: ['', Validators.required],
      telefonoFijo: ['', Validators.required],
      telefonoCelular: ['', Validators.required],
      direccion: ['', Validators.required],
      nombre: ['', Validators.required],
      horaFinal: ['', Validators.required],
      horaInicial: ['', Validators.required],
    })
  }

  async ngOnInit(): Promise<void> {
    this.resultado_usuario = await this.usuariosService.getTenderoInfo()
    this.resultado_tienda = await this.tiendasService.getTiendaInfo()
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('onSubmit')
    }
  }
}
