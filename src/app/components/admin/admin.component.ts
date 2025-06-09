import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  usuarios: any[] = [];
  rutinas: any[] = [];
  dietas: any[] = [];

  // Arrays locales
objetivos: any[] = [];
alergias: any[] = [];
tiposDieta: any[] = [];

  nuevoObjetivo: string = '';
  nuevoTipoDieta: string = '';
  nuevaAlergia: string = '';

  nuevaRutina: any = {
    objetivo: '',
    dias_por_semana: '',
    tipo_entrenamiento: '',
    semana: '',
    principios: '',
    enfoque: ''
  };
  nuevaDieta: any = { nombre: '', tipo: '', alergias: '', descripcion: '' };

  // Constructor
  // Inyectamos HttpClient y Router para manejar peticiones HTTP y navegación
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
  this.cargarUsuarios();
  this.cargarRutinas();
  this.cargarDietas();
  this.cargarObjetivos();
  this.cargarAlergias();
  this.cargarTiposDieta();
  }

  // Cargar objetivos desde el servidor
  cargarObjetivos() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get('http://localhost:3000/api/admin/objetivos', { headers })
    .subscribe((res: any) => this.objetivos = res);
}


  // Usuarios
  cargarUsuarios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:3000/api/admin/users', { headers })
      .subscribe((res: any) => this.usuarios = res);
  }
 borrarUsuario(id: number) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.delete(`http://localhost:3000/api/admin/users/${id}`, { headers })
    .subscribe(() => this.cargarUsuarios());
}

  // Rutinas básicas
  cargarRutinas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:3000/api/admin/rutinas', { headers })
      .subscribe((res: any) => this.rutinas = res);
  }
  agregarRutina() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post('http://localhost:3000/api/admin/rutinas', this.nuevaRutina, { headers }).subscribe(() => {
      this.cargarRutinas();
      this.nuevaRutina = {
        objetivo: '',
        dias_por_semana: '',
        tipo_entrenamiento: '',
        semana: '',
        principios: '',
        enfoque: ''
      };
    });
  }
  editarRutina(rutina: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`http://localhost:3000/api/admin/rutinas/${rutina.id}`, rutina, { headers }).subscribe(() => this.cargarRutinas());
  }
  eliminarRutina(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`http://localhost:3000/api/admin/rutinas/${id}`, { headers }).subscribe(() => this.cargarRutinas());
  }

  // Dietas básicas
  cargarDietas() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:3000/api/admin/dietas', { headers })
      .subscribe((res: any) => this.dietas = res);
  }
agregarDieta() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const dieta = {
    ...this.nuevaDieta,
    alergias: Array.isArray(this.nuevaDieta.alergias) ? this.nuevaDieta.alergias.join(',') : this.nuevaDieta.alergias
  };
  this.http.post('http://localhost:3000/api/admin/dietas', dieta, { headers })
    .subscribe(() => {
      this.cargarDietas();
      this.nuevaDieta = { nombre: '', tipo: '', alergias: [], descripcion: '' };
    });
}
  editarDieta(dieta: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`http://localhost:3000/api/admin/dietas/${dieta.id}`, dieta, { headers })
      .subscribe(() => this.cargarDietas());
  }
  eliminarDieta(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`http://localhost:3000/api/admin/dietas/${id}`, { headers })
      .subscribe(() => this.cargarDietas());
  }

  // Métodos para agregar elementos
agregarObjetivo() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.post('http://localhost:3000/api/admin/objetivos', { objetivo: this.nuevoObjetivo }, { headers })
    .subscribe(() => {
      this.cargarObjetivos(); // <-- Esto recarga la lista
      this.nuevoObjetivo = '';
    });
}
// Cargar alergias
cargarAlergias() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get('http://localhost:3000/api/admin/alergias', { headers })
    .subscribe((res: any) => this.alergias = res);
}
// Cargar tipos de dieta
cargarTiposDieta() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.get('http://localhost:3000/api/admin/tipos-dieta', { headers })
    .subscribe((res: any) => this.tiposDieta = res);
}
// Manejar cambio de alergias
onAlergiaChange(event: any) {
  const value = event.target.value;
  if (!this.nuevaDieta.alergias) {
    this.nuevaDieta.alergias = [];
  }
  if (event.target.checked) {
    if (!this.nuevaDieta.alergias.includes(value)) {
      this.nuevaDieta.alergias.push(value);
    }
  } else {
    this.nuevaDieta.alergias = this.nuevaDieta.alergias.filter((a: string) => a !== value);
  }
}
// Agregar alergia
agregarAlergia() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.post('http://localhost:3000/api/admin/alergias', { alergia: this.nuevaAlergia }, { headers })
    .subscribe(() => {
      this.cargarAlergias();
      this.nuevaAlergia = '';
    });
}

// Agregar tipo de dieta
agregarTipoDieta() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.post('http://localhost:3000/api/admin/tipos-dieta', { tipo: this.nuevoTipoDieta }, { headers })
    .subscribe(() => {
      this.cargarTiposDieta();
      this.nuevoTipoDieta = '';
    });
}
  get usuariosNoAdmin() {
  return this.usuarios.filter(u => u.rol !== 'admin');
}

  // Navegación
  volverAlLogin() {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}
}
