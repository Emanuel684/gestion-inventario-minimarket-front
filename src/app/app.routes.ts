import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/app.component';
import { LoginComponent } from './components/login/app.component';
import { ClientesComponent } from './components/clientes/app.component';
import { InventarioComponent } from './components/inventario/app.component';
import { NegocioComponent } from './components/negocio/app.component';
import { RecuperacionComponent } from './components/recuperacion_cuenta/app.component';
import { TenderoComponent } from './components/tendero/app.component';
import { ProductosComponent } from './components/productos/app.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'clientes', component: ClientesComponent },
    { path: 'home', component: HomeComponent },
    { path: 'inventario', component: InventarioComponent },
    { path: 'login', component: LoginComponent },
    { path: 'negocio', component: NegocioComponent },
    { path: 'recuperacion-cuenta', component: RecuperacionComponent },
    { path: 'tendero', component: TenderoComponent },
    { path: 'productos', component: ProductosComponent },
  ];