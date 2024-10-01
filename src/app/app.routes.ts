import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/app.component';
import { LoginComponent } from './components/login/app.component';

// export const routes: Routes = [];
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent }
  ]
