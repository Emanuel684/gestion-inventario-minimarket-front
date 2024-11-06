import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css',
  host: { ngSkipHydration: 'true' },
})
export class EquipoComponent implements OnInit {
  title = 'Equipo'
  userId = 0
  constructor() {}

  ngOnInit(): void {
    console.log('oninit')
  }
}
