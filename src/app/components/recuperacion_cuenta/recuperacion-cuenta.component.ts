import { CommonModule, formatCurrency } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
// import { ToastrService } from 'ngx-toastr';
import { UsuariosService } from '../../services/usuarios.services'

@Component({
  selector: 'app-recuperacion-cuenta',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './recuperacion-cuenta.component.html',
  styleUrl: './recuperacion-cuenta.component.css',
  host: { ngSkipHydration: 'true' },
})
export class RecuperacionComponent implements OnInit {
  title = 'Recuperacion'
  contactForm!: FormGroup
  userId = 0
  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
  ) {
    this.contactForm = this.fb.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
    // this.userId = this.loginService.userId;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value)
      this.usuariosService.getUsuario()
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
