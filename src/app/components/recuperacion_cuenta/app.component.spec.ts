import { TestBed } from '@angular/core/testing';
import { RecuperacionComponent } from './app.component';

describe('RecuperacionComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperacionComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(RecuperacionComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'my-app' title`, () => {
    const fixture = TestBed.createComponent(RecuperacionComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('my-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(RecuperacionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, my-app');
  });
});
