import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './privacidad.component.html',
  styleUrl: './privacidad.component.css',
  host: { ngSkipHydration: 'true' },
})
export class PrivacidadComponent implements OnInit {
  title = 'Privacidad'
  userId = 0
  constructor() {}

  ngOnInit(): void {
    console.log('oninit')
  }
}
