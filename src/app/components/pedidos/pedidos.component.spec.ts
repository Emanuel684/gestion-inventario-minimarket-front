import { TestBed } from '@angular/core/testing'
import { PedidosComponent } from './pedidos.component'

describe('ClientesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosComponent],
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PedidosComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have the 'my-app' title`, () => {
    const fixture = TestBed.createComponent(PedidosComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('my-app')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(PedidosComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-app')
  })
})
