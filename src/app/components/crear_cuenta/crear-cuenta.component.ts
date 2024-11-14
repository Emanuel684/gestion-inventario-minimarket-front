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
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_validator: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
  }

  async onSubmit() {
    if (this.contactForm.valid && this.contactForm.value.password == this.contactForm.value.password_validator) {
      var resultado = await this.loginService.postUsuario(this.contactForm.value)
    }else{
      console.log('No se pudo crear la cuenta')
    }
  }
}
