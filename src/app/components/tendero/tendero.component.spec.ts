import { TestBed } from '@angular/core/testing'
import { TenderoComponent } from './tendero.component'

describe('TenderoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderoComponent],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TenderoComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have the 'my-app' title`, () => {
    const fixture = TestBed.createComponent(TenderoComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('my-app')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(TenderoComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-app')
  })
})
