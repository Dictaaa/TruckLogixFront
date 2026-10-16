import {
  AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BRAND } from '../../core/config/brand.config';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../core/components/theme-toggle/theme-toggle';
import { RevealDirective } from '../../core/directives/reveal.directive';

interface Feature {
  title: string;
  text: string;
  icon: string[];   // trazos SVG (atributo d) del ícono, viewBox 0 0 24 24
}

interface PlanItem {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  tag: string;
  description: string;
  price: number;          // COP por vehículo al mes (pago mensual)
  highlight?: boolean;
  items: PlanItem[];
}

/** Descuento del pago anual */
const ANNUAL_DISCOUNT = 0.15;

@Component({
  selector: 'app-landing',   // distinto de app-home (el dashboard)
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, RevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, AfterViewInit {

  private title  = inject(Title);
  private auth   = inject(AuthService);
  private router = inject(Router);

  @ViewChild('heroVideo') heroVideo?: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar?: ElementRef<HTMLElement>;
  @ViewChild('navBar') navBar?: ElementRef<HTMLElement>;

  brand = BRAND;
  year  = new Date().getFullYear();

  /** Mensual / anual en la sección de planes */
  billing: 'monthly' | 'annual' = 'monthly';
  annualDiscountPct = Math.round(ANNUAL_DISCOUNT * 100);

  /** Si ya hay sesión, los botones llevan directo al portal */
  get isLoggedIn(): boolean {
    try { return !!this.auth.getUser(); } catch { return false; }
  }

  nav = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'como-funciona', label: 'Cómo funciona' },
    { id: 'planes', label: 'Planes' },
    { id: 'contacto', label: 'Contacto' },
  ];

  stats = [
    { value: '24/7', label: 'Portal disponible' },
    { value: '100%', label: 'Trazabilidad de viajes' },
    //{ value: '20\' · 40\'', label: 'Contenedores' },
  ];

  features: Feature[] = [
    {
      title: 'Administración integral de flota',
      text: 'Operamos tu tractocamión de punta a punta: viajes, conductores, documentos y costos en un solo lugar.',
      icon: [
        'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2',
        'M15 18H9',
        'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14',
        'M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
        'M15 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
      ],
    },
    {
      title: 'Rentabilidad e indicadores',
      text: 'Producción, cumplimiento de metas y estado de resultados (PYG) por placa, mes a mes.',
      icon: ['M22 7 13.5 15.5 8.5 10.5 2 17', 'M16 7h6v6'],
    },
    {
      title: 'Gestión de mantenimiento',
      text: 'Preventivos y correctivos registrados, con costo de mano de obra y repuestos por vehículo.',
      icon: ['M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'],
    },
    {
      title: 'Gestión de conductores',
      text: 'Conductores asignados, seguridad social al día y control de la operación diaria.',
      icon: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M8 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0'],
    },
    {
      title: 'Facturación y liquidación',
      text: 'Cada viaje sigue su ciclo: orden de compra, factura y liquidación, sin perder ninguno.',
      icon: [
        'M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z',
        'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8',
        'M12 17.5v-11',
      ],
    },
    {
      title: 'Trazabilidad en tiempo real',
      text: 'Movimientos de contenedores entre puertos, patios y clientes, con su estado al día.',
      icon: ['M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', 'M9 10a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
    },
    {
      title: 'Control de combustible',
      text: 'Galones, kilómetros y rendimiento por vehículo para detectar a tiempo cualquier desviación.',
      icon: [
        'M3 22h12', 'M4 9h10',
        'M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18',
        'M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5',
      ],
    },
    {
      title: 'Protección del patrimonio',
      text: 'SOAT, tecnomecánica y seguros vigilados con alertas antes de su vencimiento.',
      icon: [
        'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
        'm9 12 2 2 4-4',
      ],
    },
    {
      title: 'Transparencia total',
      text: 'Ves lo mismo que nosotros: cada viaje, cada gasto y cada peso que produce tu vehículo.',
      icon: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z', 'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
    },
  ];

  steps = [
    { n: '01', title: 'Afilias tu vehículo', text: 'Registramos tu tractocamión, sus documentos y las condiciones de operación.' },
    { n: '02', title: 'Lo ponemos a producir', text: 'Asignamos viajes de contenedores entre puertos, patios y clientes.' },
    { n: '03', title: 'Controlamos los costos', text: 'Combustible, mantenimiento, conductor y seguros, registrados y auditables.' },
    { n: '04', title: 'Ves los resultados', text: 'Producción, facturación y utilidad de tu placa en el portal, cuando quieras.' },
  ];

  audiences = [
    {
      title: 'Propietarios de vehículos',
      text: 'Tienes una o varias mulas y quieres que produzcan sin tener que administrarlas tú.',
      points: [
        'Producción y utilidad de cada placa',
        'Mantenimientos y combustible detallados',
        'Alertas de documentos por vencer',
      ],
    },
    {
      title: 'Empresas que mueven contenedores',
      text: 'Necesitas transporte confiable de contenedores con información clara de cada servicio.',
      points: [
        'Trazabilidad de cada movimiento',
        'Órdenes de compra y facturación en orden',
        'Operación respaldada por datos',
      ],
    },
  ];

  // ── PLANES (precios de referencia, cámbialos aquí) ────────────────────
  plans: Plan[] = [
    {
      id: 'consulta',
      name: 'Consulta',
      tag: 'Ver tu información',
      description: 'Para quien opera su propio vehículo y quiere tener toda su información organizada.',
      price: 90000,
      items: [
        { text: 'Portal 24/7 por placa', included: true },
        { text: 'Registro de viajes y producción', included: true },
        { text: 'Alertas de SOAT y tecnomecánica', included: true },
        { text: 'Asignación de viajes', included: false },
        { text: 'Gestión de mantenimiento', included: false },
        { text: 'Estado de resultados (PYG)', included: false },
      ],
    },
    {
      id: 'viajes',
      name: 'Solo viajes',
      tag: 'Ponemos a producir tu mula',
      description: 'Te asignamos viajes de contenedores y gestionamos su facturación.',
      price: 350000,
      items: [
        { text: 'Todo lo del plan Consulta', included: true },
        { text: 'Asignación de viajes de contenedores', included: true },
        { text: 'Órdenes de compra, facturación y liquidación', included: true },
        { text: 'Trazabilidad de cada movimiento', included: true },
        { text: 'Gestión de mantenimiento', included: false },
        { text: 'Estado de resultados (PYG)', included: false },
      ],
    },
    {
      id: 'viajes-mtto',
      name: 'Viajes + Mantenimiento',
      tag: 'El más elegido',
      description: 'Producción y cuidado del vehículo: lo mantenemos rodando y en buen estado.',
      price: 650000,
      highlight: true,
      items: [
        { text: 'Todo lo del plan Solo viajes', included: true },
        { text: 'Gestión de mantenimiento preventivo y correctivo', included: true },
        { text: 'Control de combustible y rendimiento', included: true },
        { text: 'Control de documentos y seguros', included: true },
        { text: 'Estado de resultados (PYG)', included: false },
        { text: 'Gestión del conductor', included: false },
      ],
    },
    {
      id: 'integral',
      name: 'Integral',
      tag: 'Administración completa',
      description: 'Nos encargamos de todo y tú solo revisas resultados.',
      price: 950000,
      items: [
        { text: 'Todo lo del plan Viajes + Mantenimiento', included: true },
        { text: 'Estado de resultados (PYG) por placa', included: true },
        { text: 'Gestión del conductor y seguridad social', included: true },
        { text: 'Provisiones de SOAT, tecnomecánica y dotación', included: true },
        { text: 'Informe mensual de rentabilidad', included: true },
        { text: 'Asesor dedicado', included: true },
      ],
    },
  ];

  ngOnInit(): void {
    this.title.setTitle(`${this.brand.name} · ${this.brand.tagline}`);
  }

  ngAfterViewInit(): void {
    this.startHeroVideo();
    this.onScroll();
  }

  // ── Video de la portada: siempre silenciado, en bucle y sin controles ──
  private startHeroVideo(): void {
    const video = this.heroVideo?.nativeElement;
    if (!video) return;

    // Los navegadores solo permiten autoplay si está silenciado (propiedad, no solo atributo)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // Quien pidió "reducir movimiento" ve la imagen fija
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      return;
    }
    video.play().catch(() => { /* sin autoplay: queda el fondo de respaldo */ });
  }

  // ── Barra de progreso de lectura y sombra de la barra superior ─────────
  @HostListener('window:scroll')
  onScroll(): void {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

    if (this.progressBar) this.progressBar.nativeElement.style.transform = `scaleX(${pct})`;
    this.navBar?.nativeElement.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  /** Desplazamiento suave a una sección */
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToPortal(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    const role = this.auth.getUser()?.role;
    this.router.navigate([role === 4 ? '/fuel-logs' : '/transport-movements']);
  }

  // ── Planes ─────────────────────────────────────────────────────────────
  /** Precio mensual a mostrar según el ciclo elegido */
  planPrice(plan: Plan): number {
    if (this.billing === 'monthly') return plan.price;
    return Math.round((plan.price * (1 - ANNUAL_DISCOUNT)) / 1000) * 1000;
  }

  /** Total del año (solo para el modo anual) */
  planYearTotal(plan: Plan): number {
    return this.planPrice(plan) * 12;
  }

  formatCOP(value: number): string {
    return '$' + Math.round(value).toLocaleString('es-CO');
  }

  /** Enlace para pedir el plan: WhatsApp si está configurado, si no correo */
  planLink(plan: Plan): string {
    const cycle = this.billing === 'monthly' ? 'mensual' : 'anual';
    const msg = `Hola, me interesa el plan ${plan.name} (${cycle}) de ${this.brand.name}.`;
    if (this.brand.whatsapp) {
      return `https://wa.me/${this.brand.whatsapp}?text=${encodeURIComponent(msg)}`;
    }
    return `mailto:${this.brand.supportEmail}?subject=${encodeURIComponent('Plan ' + plan.name)}&body=${encodeURIComponent(msg)}`;
  }
}