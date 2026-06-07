import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { AuthService } from '../../../../core/services/auth.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';

const MONTH_NAMES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface VehicleRow {
  plate: string; months: Record<number, number>;
  total: number; promedio: number;
  produccion: 'BUENO' | 'REGULAR' | 'BAJO'; proyeccion: number;
}
interface AffiliateBlock {
  name: string; vehicles: VehicleRow[];
  totals: Record<number, number>; grandTotal: number;
  produccion: 'BUENO' | 'REGULAR' | 'BAJO'; proyeccion: number;
}
interface KpiCard {
  label: string; value: number; formatted: string;
  icon: string; color: string; subtitle: string;
}
interface AlertItem {
  plate: string; type: 'SOAT' | 'RTM'; expiration: string;
  daysLeft: number; status: 'expired' | 'warning' | 'ok';
}
interface BarData { label: string; value: number; pct: number; color: string; }

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  private auth = inject(AuthService);
  private api  = inject(ApiService);
  private cdr  = inject(ChangeDetectorRef);

  loading      = true;
  loadingKpis  = true;
  year         = new Date().getFullYear();
  yearOptions  = [2024, 2025, 2026];
  monthNames   = MONTH_NAMES;

  affiliates:     AffiliateBlock[] = [];
  activeMonths:   number[]         = [];
  affiliatesList: any[]            = [];
  selectedAffiliate = '';

  kpis:   KpiCard[]   = [];
  alerts: AlertItem[] = [];
  bars:   BarData[]   = [];

  // Contadores animados
  animatedValues: Record<string, number> = {};

  get isAdmin(): boolean { return this.auth.hasRole([1]); }

  ngOnInit(): void {
  if (this.isAdmin) {
    this.loadAffiliates();
  } else if (this.auth.hasRole([3])) {
    // Afiliado ve solo lo suyo
    this.selectedAffiliate = String(this.auth.getUser()?.company_id ?? '');
  }
  this.load();
  this.loadKpis();
}

  loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliatesList = d;
    });
  }

  load(): void {
    this.loading = true;
    let url = `${ENDPOINTS.TRIPS.PRODUCTION_AFFILIATES}?year=${this.year}`;
    if (this.selectedAffiliate) url += `&affiliate_id=${this.selectedAffiliate}`;
    this.api.getAuth(url).subscribe({
      next: (data: any) => {
        this.processData(data);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  loadKpis(): void {
  this.loadingKpis = true;

  // Construye la URL con el filtro de afiliado si aplica
  const isAfiliado = this.auth.hasRole([3]);
  const affiliateId = isAfiliado
    ? this.auth.getUser()?.company_id
    : this.selectedAffiliate || null;

  let tripsUrl = ENDPOINTS.TRIPS.LIST;
  // Si el endpoint soporta filtro por afiliado, úsalo
  // Si no, filtramos en el frontend después de cargar

  this.api.getAuth(tripsUrl).subscribe({
    next: (data: any) => {
      let trips = data as any[];

      // Filtra por afiliado en frontend
      if (affiliateId) {
        trips = trips.filter(t => String(t.affiliate_id) === String(affiliateId));
      }

      const now       = new Date();
      const thisMonth = now.getMonth() + 1;
      const thisYear  = now.getFullYear();

      const monthTrips = trips.filter(t => {
        const d = new Date(t.trip_date);
        return d.getMonth() + 1 === thisMonth && d.getFullYear() === thisYear;
      });

      const totalFlete   = monthTrips.reduce((s, t) => s + Number(t.freight_value || 0), 0);
      const containers   = new Set(monthTrips.map((t: any) => t.container_number_id).filter(Boolean)).size;
      const activePlates = new Set(monthTrips.map((t: any) => t.vehicle_id).filter(Boolean)).size;
      const totalTrips   = monthTrips.length;

      this.kpis = [
        { label: 'Flete del Mes',    value: totalFlete,   formatted: '$ ' + totalFlete.toLocaleString('es-CO', { maximumFractionDigits: 0 }), icon: 'money',  color: '#10b981', subtitle: MONTH_NAMES[thisMonth] },
        { label: 'Movimientos',      value: totalTrips,   formatted: totalTrips.toString(),   icon: 'truck',  color: '#1a6fdb', subtitle: 'Este mes' },
        { label: 'Contenedores',     value: containers,   formatted: containers.toString(),   icon: 'box',    color: '#7c3aed', subtitle: 'Únicos este mes' },
        { label: 'Vehículos Activos',value: activePlates, formatted: activePlates.toString(), icon: 'fleet',  color: '#f59e0b', subtitle: 'Con movimientos' },
      ];

      // Barras por mes filtrando también por afiliado
      const monthMap: Record<number, number> = {};
      trips
        .filter((t: any) => new Date(t.trip_date).getFullYear() === thisYear)
        .forEach((t: any) => {
          const m = new Date(t.trip_date).getMonth() + 1;
          monthMap[m] = (monthMap[m] || 0) + Number(t.freight_value || 0);
        });

      const maxVal = Math.max(...Object.values(monthMap), 1);
      this.bars = Object.entries(monthMap)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([m, v]) => ({
          label: MONTH_NAMES[Number(m)].substring(0, 3),
          value: v,
          pct:   Math.round((v / maxVal) * 100),
          color: Number(m) === thisMonth ? '#1a6fdb' : '#93c5fd',
        }));

      this.animateCounters();
      this.loadingKpis = false;
      this.cdr.detectChanges();
    },
    error: () => { this.loadingKpis = false; }
  });

  // Alertas — filtra vehículos del afiliado
  this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe({
    next: (data: any) => {
      let vehicles = data as any[];

      // Si es afiliado, filtra por los vehículos que tienen viajes de ese afiliado
      // Usamos los trips ya filtrados — pero como son dos llamadas asíncronas,
      // simplemente mostramos todos los vehículos con alertas (admin ve todos,
      // afiliado ve los suyos via el backend que ya filtra por company_id)

      const today = new Date();
      this.alerts = [];
      vehicles.forEach((v: any) => {
        ['soat_expiration', 'rtm_expiration'].forEach(field => {
          if (!v[field]) return;
          const exp      = new Date(v[field]);
          const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / 86400000);
          if (daysLeft <= 30) {
            this.alerts.push({
              plate:      v.plate,
              type:       field === 'soat_expiration' ? 'SOAT' : 'RTM',
              expiration: v[field].substring(0, 10),
              daysLeft,
              status: daysLeft < 0 ? 'expired' : daysLeft <= 15 ? 'warning' : 'ok',
            });
          }
        });
      });
      this.alerts.sort((a, b) => a.daysLeft - b.daysLeft);
      this.cdr.detectChanges();
    }
  });
}

  private animateCounters(): void {
    this.kpis.forEach(kpi => {
      const key    = kpi.label;
      const target = kpi.value;
      let current  = 0;
      const steps  = 40;
      const inc    = target / steps;
      const timer  = setInterval(() => {
        current = Math.min(current + inc, target);
        this.animatedValues[key] = Math.round(current);
        if (current >= target) clearInterval(timer);
        this.cdr.detectChanges();
      }, 30);
    });
  }

  formatAnimated(kpi: KpiCard): string {
    const v = this.animatedValues[kpi.label] ?? 0;
    if (kpi.icon === 'money') return '$ ' + v.toLocaleString('es-CO', { maximumFractionDigits: 0 });
    return v.toString();
  }

  private processData(raw: any): void {
    const monthSet = new Set<number>();
    this.affiliates = Object.entries(raw).map(([affiliateName, vehicles]: any) => {
      const vehicleRows: VehicleRow[] = Object.entries(vehicles).map(([plate, data]: any) => {
        const months = data.months as Record<number, number>;
        Object.keys(months).forEach(m => monthSet.add(Number(m)));
        const total      = data.total;
        const meses      = Object.keys(months).length || 1;
        const promedio   = total / meses;
        return { plate, months, total, promedio, proyeccion: promedio * 7,
                 produccion: this.calcProduccion(promedio) };
      });
      const totals: Record<number, number> = {};
      vehicleRows.forEach(v => Object.entries(v.months).forEach(([m, val]) => {
        totals[Number(m)] = (totals[Number(m)] || 0) + val;
      }));
      const grandTotal   = vehicleRows.reduce((s, v) => s + v.total, 0);
      const mesesActivos = Object.keys(totals).length || 1;
      const promAfiliado = grandTotal / mesesActivos;
      return { name: affiliateName, vehicles: vehicleRows, totals, grandTotal,
               proyeccion: promAfiliado * 7, produccion: this.calcProduccion(promAfiliado) };
    });
    this.activeMonths = Array.from(monthSet).sort((a, b) => a - b);
  }

  private calcProduccion(p: number): 'BUENO' | 'REGULAR' | 'BAJO' {
    return p >= 15_000_000 ? 'BUENO' : p >= 10_000_000 ? 'REGULAR' : 'BAJO';
  }

  getMonthVal(months: Record<number, number>, m: number): number { return months[m] || 0; }
  trackAffiliate(_: number, a: AffiliateBlock) { return a.name; }
}