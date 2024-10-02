import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/app.component';
import { LoginComponent } from './components/login/app.component';
import { ClienteComponent } from './components/cliente/app.component';
import { InventarioComponent } from './components/inventario/app.component';
import { NegocioComponent } from './components/negocio/app.component';
import { RecuperacionComponent } from './components/recuperacion_cuenta/app.component';
import { TenderoComponent } from './components/tendero/app.component';

const routes: Routes = [
  { path: 'cliente', component: ClienteComponent },
  { path: 'home', component: HomeComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'negocio', component: NegocioComponent },
  { path: 'recuperacion-cuenta', component: RecuperacionComponent },
  { path: 'tendero', component: TenderoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }