import {
  CommonModule,
  // formatCurrency
} from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  // FormBuilder,
  // FormGroup,
  FormsModule,
  ReactiveFormsModule,
  // Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
// import { ToastrService } from 'ngx-toastr';
// import { ContactService } from '../../../services/contact.service';
// import { CategoryService } from '../../services/category.service'
import { UsuariosService } from '../../services/usuarios.services'
// import { UserProfileService } from '../../../services/user-profile.service';

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
    data: [
      {
        id: '6716b4727e2682dc485954a1',
        nombre_completo: 'Emanuel Acevedo',
        email: 'emanuelacag@gmail.com',
        password: 'Ytpgs9m1!',
        pais: 'Colombia',
        ciudad: 'Medellín',
        tipo: 'cliente',
        fecha_creacion: '1966-04-28T00:00:00',
        fecha_actualizacion: '1966-04-28T00:00:00',
      },
      {
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
    ],
  }

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    console.log('oninit')
    this.respuesta_clientes = this.usuariosService.getUsuariosTienda()
    // this.userId = this.loginService.userId;
  }

  // onSubmit() {
  //   if (this.contactForm.valid) {
  //     console.log(this.contactForm.value)
  //     console.log('onSubmit: ')
  //     this.loginService.postUsuario()
  //     // console.log('result: ', result)
  //     // this.contactService.sendMessage(this.contactForm.value).subscribe(
  //     //   (response) => {
  //     //     this.toastrService.success('Message sent successfully!');
  //     //     this.contactForm.reset(); // Reset form after submission
  //     //   },
  //     //   (error) => {
  //     //     this.toastrService.error('Error sending message. Please try again.');
  //     //   }
  //     // );
  //   }
  // }
}
