import { CommonModule, 
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
  
  constructor(
    private usuariosService: UsuariosService,
  ) {
    
  }

  ngOnInit(): void {
    console.log('oninit')
    var result = this.usuariosService.getUsuariosTienda()
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
