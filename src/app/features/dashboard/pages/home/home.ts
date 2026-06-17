import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { AuthService } from '../../../../core/services/auth.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { SumPropPipe } from '../../../../shared/pipes/sum-prop.pipe';

const MONTH_NAMES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, SumPropPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  private auth = inject(AuthService);
  private api  = inject(ApiService);
  private cdr  = inject(ChangeDetectorRef);

  loading     = true;
  monthNames  = MONTH_NAMES;
  year        = new Date().getFullYear();
  yearOptions = [2024, 2025, 2026];

  affiliatesList:    any[] = [];
  selectedAffiliate  = '';

  // Datos del dashboard
  affiliates:    any[] = [];
  activeMonths:  number[] = [];
  thisMonth      = new Date().getMonth() + 1;
  daysInMonth    = 0;
  dayOfMonth     = 0;
  daysRemaining  = 0;

  get isAdmin(): boolean { return this.auth.hasRole([1]); }

  ngOnInit(): void {
    if (this.isAdmin) this.loadAffiliates();
    else if (this.auth.hasRole([3])) {
      this.selectedAffiliate = String(this.auth.getUser()?.company_id ?? '');
    }
    this.load();
  }

  loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliatesList = d;
    });
  }

  kpis: any = null;
monthlyBillingBars: { label: string; value: number; pct: number; color: string }[] = [];
animatedValues: Record<string, number> = {};

// En load(), después de asignar affiliates:
load(): void {
  this.loading = true;
  let url = `${ENDPOINTS.DASHBOARD.LIST}?year=${this.year}`;
  if (this.selectedAffiliate) url += `&affiliate_id=${this.selectedAffiliate}`;
  

  this.api.getAuth(url).subscribe({
    next: (res: any) => {
      const maxMonth = this.year === new Date().getFullYear()
    ? res.thisMonth
    : 12;
      this.affiliates      = res.affiliates;
      this.activeMonths = Array.from({ length: maxMonth }, (_, i) => i + 1);
      this.thisMonth       = res.thisMonth;
      this.daysInMonth     = res.daysInMonth;
      this.dayOfMonth      = res.dayOfMonth;
      this.daysRemaining   = res.daysRemaining;
      this.kpis            = res.kpis;
      this.buildBars(res.kpis.monthlyBilling, res.thisMonth);
      this.animateKpis(res.kpis);
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => { this.loading = false; }
  });
}

private buildBars(billing: Record<number, number>, thisMonth: number): void {
  const maxVal = Math.max(...Object.values(billing), 1);
  this.monthlyBillingBars = Object.entries(billing)
    .filter(([, v]) => v > 0)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([m, v]) => ({
      label: MONTH_NAMES[Number(m)].substring(0, 3),
      value: v as number,
      pct:   Math.round(((v as number) / maxVal) * 100),
      color: Number(m) === thisMonth ? '#1a6fdb' : '#93c5fd',
    }));
}

private animateKpis(kpis: any): void {
  const targets: Record<string, number> = {
    yesterdayTrips:   kpis.yesterdayTrips,
    thisMonthTrips:   kpis.thisMonthTrips,
    thisMonthTotal:   kpis.thisMonthTotal,
    yesterdayBilling: kpis.yesterdayBilling,
  };
  Object.entries(targets).forEach(([key, target]) => {
    let current = 0;
    const inc   = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      this.animatedValues[key] = Math.round(current);
      if (current >= target) clearInterval(timer);
      this.cdr.detectChanges();
    }, 30);
  });
}

formatMoney(v: number): string {
  return '$ ' + v.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

  getMonthVal(months: Record<number, number>, m: number): number {
    return months[m] || 0;
  }

  docStatusClass(status: string): string {
    return status === 'expired' ? 'badge-expired'
         : status === 'critical' ? 'badge-expired'
         : status === 'warning'  ? 'badge-warning'
         : 'badge-ok';
  }

  trackAffiliate(_: number, a: any) { return a.id; }

  sumMonths(plates: any[], month: number): Record<number, number> {
  const result: Record<number, number> = {};
  plates.forEach(p => {
    result[month] = (result[month] || 0) + (p.months[month] || 0);
  });
  return result;
}

// Cambia sumMonths por sumMonthValue
sumMonthValue(plates: any[], month: number): number {
  return plates.reduce((s, p) => s + (p.months[month] || 0), 0);
}

// Meta por defecto 15M por placa, ajusta según tu negocio
getPct(value: number, meta: number): number {
  return Math.min(Math.round((value / meta) * 100), 999);
}

getCircleDash(value: number, meta: number): string {
  const pct = Math.min((value / meta) * 100, 100);
  return `${pct} ${100 - pct}`;
}

getCircleColor(value: number, meta: number): string {
  const pct = (value / meta) * 100;
  if (pct >= 100) return '#10b981'; // verde
  if (pct >= 70)  return '#f59e0b'; // amarillo
  return '#ef4444';                  // rojo
}
}