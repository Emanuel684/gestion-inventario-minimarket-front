// import { Component, OnInit } from '@angular/core'
// import { RouterOutlet } from '@angular/router'
// import { UserServiceService } from './user-service.service'

// interface User {
//   id: number
//   name: string
//   email: string
// }

// @Component({
//   selector: 'crear-cuenta',
//   standalone: true,
//   imports: [RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
// })
// export class CrearCuentaComponent implements OnInit {
//   // ngOnInit(): void {
//   //   throw new Error('Method not implemented.')
//   // }
//   // title = 'Crear Cuenta'
//   title = 'Crear Cuenta'
//   users: User[] | undefined

//   newUser: User = {
//     id: 0,
//     name: '',
//     email: '',
//   }

//   constructor(private userService: UserServiceService) {}

//   ngOnInit() {
//     this.fetchUsers()
//   }

//   fetchUsers() {
//     this.userService.fetchUsers().subscribe(
//       (response) => {
//         this.users = response
//       },
//       (error) => {
//         console.error(error)
//       },
//     )
//   }

//   createUser() {
//     this.userService.createUser(this.newUser).subscribe(
//       (response) => {
//         console.log('User created:', response)
//         // Refresh the user list after creating a new user
//         this.fetchUsers()
//         // this.resetNewUser()
//       },
//       (error) => {
//         console.error(error)
//       },
//     )
//   }

//   deleteUser(userId: number) {
//     this.userService.deleteUser(userId).subscribe(
//       () => {
//         console.log('User deleted')
//         // Refresh the user list after deleting a user
//         this.fetchUsers()
//       },
//       (error) => {
//         console.error(error)
//       },
//     )
//   }
// }



import { Component, OnInit } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ConfigService } from './user-service.service'

interface User {
  id: number
  name: string
  email: string
}

@Component({
  selector: 'crear-cuenta',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class CrearCuentaComponent implements OnInit {
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.')
  // }
  // title = 'Crear Cuenta'
  title = 'Crear Cuenta'
  
  data: any;

  constructor(private dataService: ConfigService) {}

  ngOnInit() {
    // this.dataService.getData().subscribe((response) => {
    //   this.data = response;
    //   console.log(this.data);
    // });
  }
  
}

