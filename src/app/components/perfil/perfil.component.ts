import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interfaces para tipado
interface Ejercicio {
  nombre: string;
  series: string;
  repeticiones: string;
  descanso: string;
}
interface Comida {
  nombre: string;
  alimentos: string;
  cantidad: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  user: any = {};
  rutina: any[] = [];
  mostrarRutina: boolean = false;
  editando: boolean = false;
  rutinaIA: any[] = [];
  dietaIA: any[] = [];
  selectedImageFile: File | null = null;
  mostrarDieta: boolean = false;
  mostrarSeleccionDieta: boolean = false;
  dietaActual: { nombre: string; descripcion: string } = { nombre: '', descripcion: '' };
  mostrarEntrenadorIA: boolean = false;
  mensajesIA: { usuario: boolean; texto: string }[] = [];
  mensajeIA: string = '';
  tipoRespuesta: string = 'rutina';
  cargandoIA: boolean = false;
  tiposDieta: any[] = [];
  alergias: any[] = [];
  dietaSeleccionada: any = { tipo: '', alergias: [] };
  objetivos: any[] = [];

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró un token. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.userId;
      if (!userId) {
        console.error('El token no contiene un ID de usuario válido.');
        this.router.navigate(['/login']);
        return;
      }
      this.http.get(`http://localhost:3000/api/usuarios/perfil/${userId}`).subscribe({
        next: (response: any) => {
          this.user = response;
          if (this.user.dieta_id) {
            this.cargarDieta();
          }
          this.cargarRutinaIA();
          this.cargarDietaIA();
        },
        error: (error) => {
          console.error('Error al obtener la información del usuario:', error);
        },
      });
      // Cargar tipos de dieta y alergias al iniciar
      this.cargarTiposDieta();
      this.cargarAlergias();
      this.cargarObjetivos();
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      this.router.navigate(['/login']);
    }
  }

cargarObjetivos() {
  this.http.get('http://localhost:3000/api/usuarios/objetivos-public').subscribe((res: any) => this.objetivos = res);
}

cargarTiposDieta() {
  this.http.get('http://localhost:3000/api/usuarios/tipos-dieta-public').subscribe((res: any) => this.tiposDieta = res);
}
cargarAlergias() {
  this.http.get('http://localhost:3000/api/usuarios/alergias-public').subscribe((res: any) => this.alergias = res);
}

  onAlergiaChange(event: any) {
    const value = event.target.value;
    if (!this.dietaSeleccionada.alergias) {
      this.dietaSeleccionada.alergias = [];
    }
    if (event.target.checked) {
      if (!this.dietaSeleccionada.alergias.includes(value)) {
        this.dietaSeleccionada.alergias.push(value);
      }
    } else {
      this.dietaSeleccionada.alergias = this.dietaSeleccionada.alergias.filter((a: string) => a !== value);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64Foto = e.target.result.split(',')[1];
      this.http.put(`http://localhost:3000/api/usuarios/users/${this.user.id_usuario}/foto`, { foto: base64Foto }).subscribe({
        next: (response: any) => {
          console.log('Foto actualizada correctamente:', response);
          alert('La foto se ha actualizado correctamente.');
          this.user.foto = base64Foto;
        },
        error: (error) => {
          console.error('Error al actualizar la foto:', error);
          alert('Hubo un error al actualizar la foto. Por favor, inténtalo de nuevo.');
        },
      });
    };
    reader.readAsDataURL(file);
  }
}
  toggleEditar(): void {
    this.editando = !this.editando;
  }

 guardarCambios(): void {
  if (!this.user.id_usuario) {
    console.error('No se puede guardar porque falta el ID del usuario.');
    return;
  }
  this.http.put(`http://localhost:3000/api/usuarios/users/${this.user.id_usuario}`, this.user).subscribe({
    next: (response: any) => {
      console.log('Datos actualizados correctamente:', response);
      alert('Los cambios se han guardado correctamente.');
      this.cargarRutina();
    },
    error: (error) => {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo.');
    },
  });
}

  cargarRutina(): void {
    if (!this.user.objetivo) {
      console.error('No se puede cargar la rutina porque falta el objetivo del usuario.');
      return;
    }
    this.http.get(`http://localhost:3000/api/rutinas/${this.user.objetivo}`).subscribe({
      next: (response: any) => {
        this.rutina = response;
        console.log('Rutina cargada correctamente:', this.rutina);
      },
      error: (error) => {
        console.error('Error al cargar la rutina:', error);
      },
    });
  }

  toggleRutina(): void {
    if (!this.mostrarRutina) {
      this.cargarRutina();
      this.mostrarRutina = true;
    } else {
      this.mostrarRutina = false;
    }
  }

  toggleDieta(): void {
    if (this.user.dieta_id) {
      this.mostrarDieta = !this.mostrarDieta;
    } else {
      this.mostrarSeleccionDieta = true;
    }
  }

  cambiarDieta(): void {
    this.mostrarDieta = false;
    this.mostrarSeleccionDieta = true;
  }

  toggleSeleccionDieta(): void {
    this.mostrarSeleccionDieta = !this.mostrarSeleccionDieta;
  }

  guardarDieta(event: Event): void {
    event.preventDefault();
    if (!this.dietaSeleccionada.tipo) {
      alert('Por favor, selecciona un tipo de dieta.');
      return;
    }
    // Convertir alergias a string separado por comas
    const alergiasString = Array.isArray(this.dietaSeleccionada.alergias)
      ? this.dietaSeleccionada.alergias.join(',')
      : this.dietaSeleccionada.alergias || '';
    const datosDieta = {
      id_usuario: this.user.id_usuario,
      tipo: this.dietaSeleccionada.tipo,
      alergias: alergiasString
    };
    this.http.post('http://localhost:3000/api/usuarios/dietas/asignar', datosDieta).subscribe({
      next: (response: any) => {
        console.log('Dieta asignada:', response);
        this.user.dieta_id = response.dieta_id;
        this.cargarDieta();
        this.mostrarSeleccionDieta = false;
        alert('Dieta asignada correctamente.');
      },
      error: (error) => {
        console.error('Error al asignar la dieta:', error);
        alert('Hubo un error al asignar la dieta. Por favor, inténtalo de nuevo.');
      }
    });
  }

  cargarDieta(): void {
    if (!this.user.dieta_id) {
      console.error('No se puede cargar la dieta porque falta el ID de la dieta.');
      return;
    }
    this.http.get(`http://localhost:3000/api/usuarios/dietas/asignada/${this.user.id_usuario}`).subscribe({
      next: (response: any) => {
        this.dietaActual = response;
        console.log('Dieta cargada correctamente:', this.dietaActual);
      },
      error: (error) => {
        console.error('Error al cargar la dieta asignada:', error);
      }
    });
  }

  toggleEntrenadorIA(): void {
    this.mostrarEntrenadorIA = !this.mostrarEntrenadorIA;
  }

  setTipoRespuesta(tipo: string): void {
    this.tipoRespuesta = tipo;
  }

  pedirIA(tipo: string): void {
    this.setTipoRespuesta(tipo);
    this.mensajeIA = '';
    this.enviarMensajeIA();
  }

  enviarMensajeIA(event?: Event): void {
    if (event) event.preventDefault();

    this.cargandoIA = true; // INICIA LA CARGA

    // Mensaje automático según tipo
    this.mensajesIA.push({
      usuario: true,
      texto: this.tipoRespuesta === 'rutina'
        ? 'Quiero una rutina personalizada.'
        : 'Quiero una dieta personalizada.'
    });

    this.rutinaIA = [];
    this.dietaIA = [];

    const datosUsuario = {
      edad: this.user.edad,
      altura: this.user.altura,
      peso: this.user.peso_actual,
      sexo: this.user.sexo,
      objetivo: this.user.objetivo,
      alergias: this.dietaSeleccionada.alergias,
      tipoDieta: this.dietaSeleccionada.tipo,
      tipoRespuesta: this.tipoRespuesta
    };

    this.http.post('http://localhost:3000/api/ia/entrenador_ia', datosUsuario).subscribe({
      next: (response: any) => {
        if (response.recomendaciones) {
          if (response.recomendaciones.rutina) {
            this.rutinaIA = response.recomendaciones.rutina;
          } else {
            this.rutinaIA = [];
          }
          if (response.recomendaciones.dieta) {
            this.dietaIA = response.recomendaciones.dieta;
            console.log('DIETA IA:', this.dietaIA);
          } else {
            this.dietaIA = [];
          }
          this.mensajesIA.push({ usuario: false, texto: '' });
        } else {
          this.mensajesIA.push({ usuario: false, texto: response.recomendaciones });
        }
        this.mensajeIA = '';
        this.cargandoIA = false; // FINALIZA LA CARGA
      },
      error: (error) => {
        this.mensajesIA.push({
          usuario: false,
          texto: 'Hubo un error al generar las recomendaciones. Por favor, inténtalo de nuevo.'
        });
        this.cargandoIA = false; // FINALIZA LA CARGA
      }
    });
  }

  // Métodos auxiliares para trackBy en *ngFor (opcional, para rendimiento)
  trackByDia(index: number, item: any): any {
    return item.dia || index;
  }
  trackByNombre(index: number, item: any): any {
    return item && item.nombre ? item.nombre : index;
  }
  trackByDiaNumero(index: number, item: any): any {
    return item.dia;
  }

  // Método para guardar la rutina y dieta generadas por IA
  guardarRutinaIA(): void {
    if (!this.user.id_usuario || !this.rutinaIA.length) {
      alert('No hay rutina generada para guardar.');
      return;
    }
    this.http.post('http://localhost:3000/api/rutinas/guardar', {
      id_usuario: this.user.id_usuario,
      rutina: this.rutinaIA
    }).subscribe({
      next: () => {
        alert('Rutina guardada correctamente.');
        this.cargarRutinaIA(); // Recarga la rutina IA guardada
      },
      error: () => alert('Error al guardar la rutina.')
    });
  }

  guardarDietaIA(): void {
    if (!this.user.id_usuario || !this.dietaIA.length) {
      alert('No hay dieta generada para guardar.');
      return;
    }
    this.http.post('http://localhost:3000/api/dietas/guardar', {
      id_usuario: this.user.id_usuario,
      dieta: this.dietaIA
    }).subscribe({
      next: () => {
        alert('Dieta guardada correctamente.');
        this.cargarDietaIA(); // Recarga la dieta IA guardada
      },
      error: () => alert('Error al guardar la dieta.')
    });
  }

  cargarRutinaIA(): void {
    if (!this.user.id_usuario) return;
    this.http.get<{ rutina: any[] }>(`http://localhost:3000/api/rutinas/ia/${this.user.id_usuario}`)
      .subscribe({
        next: res => this.rutinaIA = res.rutina,
        error: () => this.rutinaIA = []
      });
  }

  cargarDietaIA(): void {
    if (!this.user.id_usuario) return;
    this.http.get<{ dieta: any[] }>(`http://localhost:3000/api/dietas/ia/${this.user.id_usuario}`)
      .subscribe({
        next: res => this.dietaIA = res.dieta,
        error: () => this.dietaIA = []
      });
  }

descargarPDF() {
  const doc = new jsPDF();
  let y = 15;

  // Datos personales
  doc.setFontSize(16);
  doc.text('Datos del Usuario', 14, y);
  doc.setFontSize(12);
  y += 8;
  doc.text(`Nombre: ${this.user.nombre || ''}`, 14, y);
  y += 7;
  doc.text(`Correo: ${this.user.correo || ''}`, 14, y);
  y += 7;
  doc.text(`Peso actual: ${this.user.peso_actual || ''} kg`, 14, y);
  y += 7;
  doc.text(`Altura: ${this.user.altura || ''} cm`, 14, y);
  y += 7;
  doc.text(`Objetivo: ${this.user.objetivo || ''}`, 14, y);
  y += 10;

  // Rutina IA o genérica (si existen datos)
  if (this.rutinaIA?.length) {
    doc.setFontSize(14);
    doc.text('Rutina personalizada IA', 14, y);
    y += 6;
    this.rutinaIA.forEach((dia: any) => {
      doc.setFontSize(12);
      doc.text(`${dia.dia}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [['Ejercicio', 'Serie', 'Repeticiones/Tiempo', 'Descanso']],
        body: dia.ejercicios.map((ej: any) => [
          ej.nombre,
          ej.series || '-',
          ej.repeticiones || ej.tiempo || '-',
          ej.descanso || '-'
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      y = (doc as any).lastAutoTable.finalY + 6;
    });
  } else if (this.rutina?.length) {
    doc.setFontSize(14);
    doc.text('Rutina', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [['Días por Semana', 'Tipo de Entrenamiento', 'Semana', 'Principios', 'Enfoque']],
      body: this.rutina.map((ej: any) => [
        ej.dias_por_semana,
        ej.tipo_entrenamiento,
        ej.semana,
        ej.principios,
        ej.enfoque
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  // Dieta IA o genérica (si existen datos)
  if (this.dietaIA?.length) {
    doc.setFontSize(14);
    doc.text('Dieta personalizada IA', 14, y);
    y += 6;
    this.dietaIA.forEach((dia: any) => {
      doc.setFontSize(12);
      doc.text(`Día ${dia.dia}`, 14, y);
      y += 4;
      autoTable(doc, {
        startY: y,
        head: [['Comida', 'Alimentos', 'Cantidad']],
        body: dia.comidas.map((comida: any) => [
          comida.nombre,
          comida.alimentos,
          comida.cantidad
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 }
      });
      y = (doc as any).lastAutoTable.finalY + 6;
    });
  } else if (this.dietaActual?.nombre) {
    doc.setFontSize(14);
    doc.text('Dieta', 14, y);
    y += 6;
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Descripción']],
      body: [[this.dietaActual.nombre, this.dietaActual.descripcion]],
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 }
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  }

  doc.save('rutina_y_dieta.pdf');
}
}
