import { TestBed } from '@angular/core/testing'
import { NegocioComponent } from './negocio.component'

describe('NegocioComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegocioComponent],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(NegocioComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have the 'my-app' title`, () => {
    const fixture = TestBed.createComponent(NegocioComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('my-app')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(NegocioComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-app')
  })
})
