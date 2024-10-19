import { Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { ClientesComponent } from './components/clientes/clientes.component'
import { InventarioComponent } from './components/inventario/inventario.component'
import { NegocioComponent } from './components/negocio/negocio.component'
import { RecuperacionComponent } from './components/recuperacion_cuenta/recuperacion-cuenta.component'
import { TenderoComponent } from './components/tendero/tendero.component'
import { ProductosComponent } from './components/productos/productos.component'
import { CrearCuentaComponent } from './components/crear_cuenta/crear-cuenta.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'home', component: HomeComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'negocio', component: NegocioComponent },
  { path: 'recuperacion-cuenta', component: RecuperacionComponent },
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'tendero', component: TenderoComponent },
  { path: 'productos', component: ProductosComponent },
]
