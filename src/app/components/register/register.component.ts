import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { CommonModule } from '@angular/common'; // Por si usas *ngIf, *ngFor
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  fecha_nacimiento: string = '';
  edad: number | null = null;
  sexo: string = '';
  altura: number | null = null;
  peso_actual: number | null = null;
  correo: string = '';
  password: string = '';
  objetivo: string = '';
  id_rutina: number | null = null; // Asignar un valor por defecto o null
  objetivos: any[] = [];
  repeatPassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
  // ...otros métodos...
  this.cargarObjetivos();
}

  onRegister() {
// Validación de campos obligatorios
  if (!this.nombre || !this.fecha_nacimiento || !this.edad || !this.sexo ||
      !this.altura || !this.peso_actual || !this.correo || !this.password || !this.objetivo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  // Validación de correo electrónico
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correo)) {
    alert('Por favor, introduce un correo válido.');
    return;
  }

  // Validación de contraseña (mínimo 6 caracteres, al menos una letra y un número)
  if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(this.password)) {
    alert('La contraseña debe tener al menos 6 caracteres, incluyendo letras y números.');
    return;
  }

  // Validación de edad
  if (this.edad < 10 || this.edad > 120) {
    alert('Introduce una edad válida.');
    return;
  }

  // Validación de altura y peso
  if (this.altura < 50 || this.altura > 250) {
    alert('Introduce una altura válida (50-250 cm).');
    return;
  }
  if (this.peso_actual < 20 || this.peso_actual > 300) {
    alert('Introduce un peso válido (20-300 kg).');
    return;
  }
  // Validar que la edad concuerde con la fecha de nacimiento
  if (this.fecha_nacimiento) {
    const nacimiento = new Date(this.fecha_nacimiento);
    const hoy = new Date();
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalculada--;
    }
    if (Number(this.edad) !== edadCalculada) {
      alert(`La edad no coincide con la fecha de nacimiento. Según la fecha, tu edad debería ser ${edadCalculada}.`);
      return;
    }
  }

    if (this.password !== this.repeatPassword) {
    alert('Las contraseñas no coinciden.');
    return;
  }

    const registerData = {
      nombre: this.nombre,
      fecha_nacimiento: this.fecha_nacimiento,
      edad: this.edad,
      sexo: this.sexo,
      altura: this.altura,
      peso_actual: this.peso_actual,
      correo: this.correo,
      password: this.password,
      objetivo: this.objetivo,
      id_rutina: this.id_rutina // Asegúrate de que id_rutina esté definido en tu backend


    };

    this.http.post('http://localhost:3000/api/register', registerData).subscribe({
      next: (response: any) => {
        console.log('Registro exitoso', response);
        alert('Usuario registrado con éxito.');
        this.router.navigate(['/login']); // Redirige al login después del registro
      },
      error: (error) => {
        console.error('Error en el registro', error);
        const errorMessage = error.status === 400 ? 'Datos inválidos.' : 'Error en el servidor.';
        alert(errorMessage);
      }
    });
  }
  cargarObjetivos() {
  this.http.get('http://localhost:3000/api/usuarios/objetivos-public').subscribe((res: any) => this.objetivos = res);
}

}
