import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { provideHttpClient } from '@angular/common/http'
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
import { TerminosComponent } from './components/terminos/terminos.component'
import { RecursosComponent } from './components/recursos/recursos.component'
import { PrivacidadComponent } from './components/privacidad/privacidad.component'
import { EquipoComponent } from './components/equipo/equipo.component'
import { CosasInteresantesComponent } from './components/cosas_interesantes/cosas-interesantes.component'
import { ContactanosComponent } from './components/contactanos/contactanos.component'
import { CheckOutComponent } from './components/check-out/check-out.component'
import { AgregarProductoComponent } from './components/agregar_producto/agregar-producto.component'

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
  { path: 'terminos', component: TerminosComponent },
  { path: 'recursos', component: RecursosComponent },
  { path: 'privacidad', component: PrivacidadComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'cosas-interesantes', component: CosasInteresantesComponent },
  { path: 'contactanos', component: ContactanosComponent },
  { path: 'check-out', component: CheckOutComponent },
  { path: 'agregar-producto', component: AgregarProductoComponent },
]

@NgModule({
  providers: [provideHttpClient()],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    FormsModule,
    CheckOutComponent,
  ],
  exports: [RouterModule],
  bootstrap: [RouterModule],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
