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
    data: {
      id: '6717c09a4f00c9c785619f29',
      nombre_completo: 'Carlos Acevedo',
      email: 'carlosacag@gmail.com',
      password: 'Ytpgs9m2!',
      pais: 'Colombia',
      ciudad: 'Medellín',
      tipo: 'tendero',
      fecha_creacion: '2024-10-22T00:00:00',
      fecha_actualizacion: '2024-10-22T00:00:00',
    },
  }
  resultado_tienda: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: {
      id: '6717c23ae417fc950c08ddae',
      id_usuario_tendero: '6717c09a4f00c9c785619f29',
      nombre: 'RanchoTienda',
      ciudad: 'Medellín',
      pais: 'Colombia',
      direccion: 'Carrera 65 C #47 Sur 44',
      telefono: '4187277',
      celular: '3187604393',
      hora_inicio: '08:00',
      hora_fin: '16:00',
      fecha_creacion: '2024-10-22T00:00:00',
      fecha_actualizacion: '2024-10-22T00:00:00',
    },
  }

  constructor(
    private usuariosService: UsuariosService,
    private tiendasService: TiendasService,
    private fb: FormBuilder,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
    var result_usuario = this.usuariosService.getTenderoInfo()
    var result_tienda = this.tiendasService.getTiendaInfo()
    this.resultado_tienda = result_tienda
    this.resultado_usuario = result_usuario
    console.log('result usuario', result_usuario)
    console.log('result tienda', result_tienda)
    // this.userId = this.loginService.userId;
  }

  onSubmit() {
    console.log('onSubmit')
    if (this.contactForm.valid) {
      // console.log(this.contactForm.value)
      // console.log('onSubmit: ')
      // this.loginService.postUsuario()
      // console.log('result: ', result)
      // this.contactService.sendMessage(this.contactForm.value).subscribe(
      //   (response) => {
      //     this.toastrService.success('Message sent successfully!');
      //     this.contactForm.reset(); // Reset form after submission
      //   },
      //   (error) => {
      //     this.toastrService.error('Error sending message. Please try again.');
      //   }
      // );
    }
  }
}
