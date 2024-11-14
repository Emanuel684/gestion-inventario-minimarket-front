import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ProductosService } from '../../services/productos.services'
import { signal, ViewChild, ElementRef } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-agregar-producto',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './agregar-producto.component.html',
  styleUrl: './agregar-producto.component.css',
  host: { ngSkipHydration: 'true' },
})
export class AgregarProductoComponent implements OnInit {
  imageName = signal('')
  fileSize = signal(0)
  uploadProgress = signal(0)
  imagePreview = signal('')
  @ViewChild('fileInput') fileInput: ElementRef | undefined
  selectedFile: File | null = null
  uploadSuccess: boolean = false
  uploadError: boolean = false
  title: string = 'Agregar producto'
  imagen_subida: any = ''
  contactForm!: FormGroup
  userId = 0
  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private snackBar: MatSnackBar,
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      tipo: ['', [Validators.required]],
      sub_tipo: ['', Validators.required],
      precio: ['', Validators.required],
      cantidadProductos: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
  }

  async onSubmit() {
    if (this.contactForm.valid) {
      await this.productosService.postProducto(
        this.contactForm.value,
        this.imagen_subida,
      )
    }
    // this._router.navigateByUrl('/productos', { skipLocationChange: false })
    window.location.reload()
  }
  // Handler for file input change
  onFileChange(event: any): void {
    const file = event.target.files[0] as File | null
    this.uploadFile(file)
  }

  // Handler for file drop
  onFileDrop(event: DragEvent): void {
    event.preventDefault()
    const file = event.dataTransfer?.files[0] as File | null
    this.uploadFile(file)
  }

  // Prevent default dragover behavior
  onDragOver(event: DragEvent): void {
    event.preventDefault()
  }

  // Method to handle file upload
  uploadFile(file: File | null): void {
    if (file && file.type.startsWith('image/')) {
      this.selectedFile = file
      this.fileSize.set(Math.round(file.size / 1024)) // Set file size in KB

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagen_subida = e.target?.result
        this.imagePreview.set(e.target?.result as string) // Set image preview URL
      }
      reader.readAsDataURL(file)

      this.uploadSuccess = true
      this.uploadError = false
      this.imageName.set(file.name) // Set image name
    } else {
      this.uploadSuccess = false
      this.uploadError = true
      this.snackBar.open('Only image files are supported!', 'Close', {
        duration: 3000,
        panelClass: 'error',
      })
    }
  }
}
