import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CosasInteresantesComponent } from './cosas-interesantes.component'

describe('CosasInteresantesComponent', () => {
  let component: CosasInteresantesComponent
  let fixture: ComponentFixture<CosasInteresantesComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CosasInteresantesComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CosasInteresantesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
