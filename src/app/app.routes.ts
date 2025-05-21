import { Routes } from '@angular/router';
import { LoginComponent } from './componnet/login/login.component';
import { HomeComponent } from './componnet/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent }  // Burada AppComponent değil HomeComponent olacak
];
