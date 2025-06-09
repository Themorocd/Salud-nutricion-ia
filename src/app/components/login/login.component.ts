import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule],

})
export class LoginComponent {
  correo: string = '';
  password: string = '';

constructor( private http: HttpClient, private router: Router) {}


onLogin() {
  if (!this.correo || !this.password) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  if (!this.correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    alert('Por favor, introduce un correo válido.');
    return;
  }

  const loginData = { correo: this.correo, password: this.password };

  this.http.post('http://localhost:3000/api/login', loginData).subscribe({
    next: (response: any) => {
      console.log('Login exitoso', response);

      // Guarda el token en el almacenamiento local
      localStorage.setItem('token', response.token);

      // Redirige según el rol
      if (response.user.rol === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/perfil'], { queryParams: { id: response.user.id_usuario } });
      }
    },
    error: (error) => {
      console.error('Error de login', error);
      let errorMessage = 'Error en el servidor.';
      if (error.status === 400 || error.status === 401) {
        errorMessage = 'Correo o contraseña incorrectos.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
      }
      alert(errorMessage);
    },
  });
}
  irARecuperarPassword() {
  this.router.navigate(['/recuperar-password']);
}


}
