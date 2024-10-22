import { CommonModule, formatCurrency } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { RouterModule } from '@angular/router'
// import { ToastrService } from 'ngx-toastr';
// import { ContactService } from '../../../services/contact.service';
import { CategoryService } from '../../services/category.service'
import { UsuariosService } from '../../services/usuarios.services'
// import { UserProfileService } from '../../../services/user-profile.service';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './contactanos.component.html',
  styleUrl: './contactanos.component.css',
  host: { ngSkipHydration: 'true' },
})
export class ContactanosComponent implements OnInit {
  contactForm!: FormGroup
  userId = 0
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    // private contactService: ContactService,
    // private toastrService: ToastrService,
    private loginService: UsuariosService,
    // private userService:UserProfileService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    console.log('oninit')
    // this.userId = this.loginService.userId;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value)
      console.log('onSubmit: ')
      this.loginService.postUsuario()
      // console.log('result: ', result)
      // this.contactService.sendMessage(this.contactForm.value).subscribe(
      //   (response) => {
      //     this.toastrService.success('Message sent successfully!');
      //     this.contactForm.reset(); // Reset form after submission
      //   },
      //   (error) => {
      //     this.toastrService.error('Error sending message. Please try again.');
      //   }
      // );
    }
  }
}
