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
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.usuariosService.getUsuario(this.contactForm.value)
    }
  }
}
