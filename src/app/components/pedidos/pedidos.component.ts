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
    data: [
      {
        id: '672a9266687e378ff111c27d',
        id_tienda: '662d0d325363bbc93a0c0295',
        id_cliente: '662d0d325363bbc93a0c0295',
        productos: '662d0d325363bbc93a0c0295,662d0d325363bbc93a0c0295',
        precio_total: '700',
        direccion: 'UNDER DECOMMISSIONING',
        fecha_entrega: '1966-04-28T00:00:00',
        fecha_creacion: '1966-04-28T00:00:00',
        fecha_actualizacion: '1966-04-28T00:00:00',
      },
    ],
  }

  constructor(private pedidosService: PedidosService) {}

  public visible = false

  toggleLiveDemo() {
    this.visible = !this.visible
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
