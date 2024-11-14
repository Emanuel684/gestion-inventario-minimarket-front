import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css',
  host: { ngSkipHydration: 'true' },
})
export class RecursosComponent implements OnInit {
  userId = 0
  constructor(
  ) {
  }

  ngOnInit(): void {
    console.log('oninit')
  }

}
