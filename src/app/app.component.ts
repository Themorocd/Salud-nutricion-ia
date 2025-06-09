// src/app/app.component.ts
import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router,NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],  // Asegúrate de que RouterOutlet esté importado aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentView: string = 'login';
  constructor(private router: Router) {}

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof localStorage === 'undefined') {
      return false; // Si localStorage no está disponible, devuelve false
    }
    return !!localStorage.getItem('token'); // Devuelve true si el token existe
  }

  // Lógica para cerrar sesión
  logout(): void {
    localStorage.removeItem('token'); // Elimina el token
    this.router.navigate(['/login']); // Redirige al login

  }
  ngOnInit(): void {
    // Detectar cambios en la ruta y actualizar la clase
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('login')) {
          this.currentView = 'login';
        } else if (event.url.includes('register')) {
          this.currentView = 'register';
        } else if (event.url.includes('perfil')) {
          this.currentView = 'perfil';
        } else if (event.url.includes('recuperar-password')) {
          this.currentView = 'recuperar-password';
        }
      }
    });
  }

}
