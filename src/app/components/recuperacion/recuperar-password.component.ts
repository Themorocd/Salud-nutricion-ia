import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.scss'],
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class RecuperarPasswordComponent {
  correo: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  solicitarRecuperacion() {
    if (!this.correo) {
      this.mensaje = 'Introduce tu correo.';
      return;
    }
    this.http.post('http://localhost:3000/api/recuperar-password', { correo: this.correo }).subscribe({
      next: () => this.mensaje = 'Si el correo existe, recibirás un email con instrucciones.',
      error: () => this.mensaje = 'Error al solicitar recuperación.'
    });
  }
}
