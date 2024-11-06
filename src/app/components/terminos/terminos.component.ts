import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './terminos.component.html',
  styleUrl: './terminos.component.css',
  host: { ngSkipHydration: 'true' },
})
export class TerminosComponent implements OnInit {
  userId = 0
  constructor() {}

  ngOnInit(): void {
    console.log('oninit')
  }
}
