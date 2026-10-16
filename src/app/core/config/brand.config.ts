/**
 * Identidad de la marca.
 * Cambia aquí el nombre y los textos: se reflejan en el home, el login
 * y el título de la pestaña del navegador.
 */
export const BRAND = {
  /** Nombre completo de la página */
  name: 'Trucklogix',
  /** Nombre corto (logo, espacios pequeños) */
  shortName: 'TLX',
  /** Frase corta bajo el nombre */
  tagline: 'Portal de clientes',
  /** Mensaje principal */
  mission: 'Transformamos vehículos en activos productivos administrados con datos, control y transparencia.',
  /** Correo de soporte */
  supportEmail: 'soporte@trucklogix.co',
  /** WhatsApp con indicativo, solo números (ej. 573001234567). Vacío = los planes abren correo */
  whatsapp: '',
  /** Ciudad / zona de operación */
  location: 'Colombia',

  /** Video de la portada (carpeta public/ en Angular 17+, o src/assets/ en versiones anteriores) */
  heroVideo: 'truck.mp4',
  /** Imagen que se ve mientras carga el video (opcional, vacío = sin imagen) */
  heroPoster: '',
} as const;