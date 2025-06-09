// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AdminComponent } from './components/admin/admin.component';
import { RecuperarPasswordComponent } from './components/recuperacion/recuperar-password.component';
import { RestablecerPasswordComponent } from './components/restablecer/restablecer-password.component';

export const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recuperacion', component: RecuperarPasswordComponent },
  { path: 'restablecer-password', component: RestablecerPasswordComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }  // Redirige a login por defecto
];
