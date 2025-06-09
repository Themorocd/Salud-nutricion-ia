import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  templateUrl: './restablecer-password.component.html',
  styleUrls: ['./restablecer-password.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class RestablecerPasswordComponent {
  nuevaPassword = '';
  repitePassword = '';
  mensaje = '';
  token = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  onSubmit() {
    if (!this.nuevaPassword || !this.repitePassword) {
      this.mensaje = 'Completa ambos campos.';
      return;
    }
    if (this.nuevaPassword !== this.repitePassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }
    this.http.post('http://localhost:3000/api/restablecer-password', {
      token: this.token,
      nuevaPassword: this.nuevaPassword
    }).subscribe({
      next: () => this.mensaje = 'Contraseña restablecida correctamente.',
      error: () => this.mensaje = 'Error al restablecer la contraseña.'
    });
  }
}
