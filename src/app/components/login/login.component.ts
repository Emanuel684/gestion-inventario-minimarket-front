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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  host: { ngSkipHydration: 'true' },
})
export class LoginComponent implements OnInit {
  title = 'Login'
  contactForm!: FormGroup
  user_info = {}
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
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      this.user_info = await this.usuariosService.getUsuario(this.contactForm.value)
    }
    console.log('this.user_info: ', this.user_info)
  }
}
