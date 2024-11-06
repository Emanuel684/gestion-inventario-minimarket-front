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
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.css',
  host: { ngSkipHydration: 'true' },
})
export class CrearCuentaComponent implements OnInit {
  contactForm!: FormGroup
  userId = 0
  constructor(
    private fb: FormBuilder,
    private loginService: UsuariosService,
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
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.loginService.postUsuario()
    }
  }
}
