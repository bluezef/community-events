export interface Evento {
  id?: string;
  titulo: string;
  descripcion: string;
  fecha: string; // Guardamos como ISO string
  ubicacion: string;
  creadorId: string; // Vital para la función de Eliminar
  asistentes: string[]; // Array de UIDs de usuarios
}

export interface Usuario {
  uid: string;
  email: string;
  nombre?: string;
}