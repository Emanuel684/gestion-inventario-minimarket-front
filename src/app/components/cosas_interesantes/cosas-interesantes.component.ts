import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-cosas-interesantes',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './cosas-interesantes.component.html',
  styleUrl: './cosas-interesantes.component.css',
  host: { ngSkipHydration: 'true' },
})
export class CosasInteresantesComponent implements OnInit {
  title = 'CosasInteresantes'
  userId = 0
  constructor() {}

  ngOnInit(): void {
    console.log('oninit')
  }
}
