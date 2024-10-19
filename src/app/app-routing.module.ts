import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule, provideHttpClient } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/login/login.component'
import { ClientesComponent } from './components/clientes/clientes.component'
import { InventarioComponent } from './components/inventario/inventario.component'
import { NegocioComponent } from './components/negocio/negocio.component'
import { RecuperacionComponent } from './components/recuperacion_cuenta/recuperacion-cuenta.component'
import { TenderoComponent } from './components/tendero/tendero.component'
import { ProductosComponent } from './components/productos/productos.component'
import { CrearCuentaComponent } from './components/crear_cuenta/crear-cuenta.component'
import { FormsModule } from '@angular/forms'

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'home', component: HomeComponent },
  { path: 'inventario', component: InventarioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'negocio', component: NegocioComponent },
  { path: 'crear-cuenta', component: CrearCuentaComponent },
  { path: 'recuperacion-cuenta', component: RecuperacionComponent },
  { path: 'tendero', component: TenderoComponent },
  { path: 'productos', component: ProductosComponent },
]

@NgModule({
  providers: [provideHttpClient()],
  imports: [RouterModule.forRoot(routes), BrowserModule, FormsModule],
  exports: [RouterModule],
  bootstrap: [RouterModule],
})
export class AppRoutingModule {}
