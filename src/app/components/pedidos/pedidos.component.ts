import { CommonModule } from '@angular/common'
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosComponent } from '../productos/productos.component'
import { PedidosService } from '../../services/pedidos.services'
import { TiendasService } from '../../services/tiendas.services'
import { UsuariosService } from '../../services/usuarios.services'
import { ViewChild, ViewContainerRef } from '@angular/core'
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
} from '@coreui/angular'
import { ProductosService } from '../../services/productos.services'

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [
    ButtonDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ThemeDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ProductosComponent,
  ],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',

  host: { ngSkipHydration: 'true' },
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class PedidosComponent implements OnInit {
  @ViewChild('view', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef

  title = 'Pedidos'

  resultados_pedidos: any = {
    msg: 'Se obtuvo el resultado exitosamente.',
    success: true,
    data: [{}],
  }

  constructor(
    private pedidosService: PedidosService,
    private usuariosService: UsuariosService,
    private tiendasService: TiendasService,
    private productosService: ProductosService,
  ) {}

  public visible = false
  public productos_model: any = []
  public tienda_model: any = {}
  public usuario_model: any = {}

  async toggleLiveDemo(item: any) {
    this.visible = !this.visible

    this.usuario_model = await this.usuariosService.getUsuario(
      item['id_cliente'],
    )

    this.tienda_model = await this.tiendasService.getTiendaInfo(
      item['id_tienda'],
    )

    const idArray = item['productos'].split(',')
    for (const element of idArray) {
      var producto_consultado =
        await this.productosService.getProductoById(element)
      this.productos_model.push(producto_consultado['data'])
    }
  }

  toggleLiveDemoClose() {
    this.visible = !this.visible
    this.productos_model = []
    this.tienda_model = {}
    this.usuario_model = {}
  }

  handleLiveDemoChange(event: any) {
    this.visible = event
  }

  ngOnInit(): void {
    this.resultados_pedidos = this.pedidosService.getAllPedidos()
  }

  deleteProducto(evento: any): void {
    this.pedidosService.deletePedido(evento)
  }
}
