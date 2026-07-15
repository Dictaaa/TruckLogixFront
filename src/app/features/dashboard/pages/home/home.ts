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
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  monthNames = MONTH_NAMES;
  year = new Date().getFullYear();
  yearOptions = [2024, 2025, 2026];

  affiliatesList: any[] = [];
  selectedAffiliate = '';

  // Datos del dashboard
  affiliates: any[] = [];
  activeMonths: number[] = [];
  thisMonth = new Date().getMonth() + 1;
  daysInMonth = 0;
  dayOfMonth = 0;
  daysRemaining = 0;

  getCumplimientoColor(pct: number): string {
  if (pct >= 100) return '#10b981';
  if (pct >= 70)  return '#f59e0b';
  return '#ef4444';
}

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
  animatedValues: Record<string, number> = {
    yesterdayTrips: 0,
    thisMonthTrips: 0,
    thisMonthTotal: 0,
    yesterdayBilling: 0,
  };

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
        this.affiliates = res.affiliates;
        this.activeMonths = Array.from({ length: maxMonth }, (_, i) => i + 1);
        this.thisMonth = res.thisMonth;
        this.daysInMonth = res.daysInMonth;
        this.dayOfMonth = res.dayOfMonth;
        this.daysRemaining = res.daysRemaining;
        this.kpis = res.kpis;
        this.buildSummaryKpis(res.affiliates, res.kpis, res.thisMonth);
        this.buildBars(res.kpis.monthlyBilling, res.thisMonth);
        this.animateKpis(res.kpis);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private buildSummaryKpis(affiliates: any[], kpis: any, thisMonth: number): void {
  // Presupuesto total del mes (suma de todos los afiliados)
  const presupuestoMes = affiliates.reduce((s, aff) => {
    return s + (Number(aff.budgets?.[thisMonth] ?? aff.budgets?.[String(thisMonth)] ?? 0));
  }, 0);

  // Producción total del mes (suma de monthTotal de todos los afiliados)
  const produccionMes = affiliates.reduce((s, aff) => s + (aff.monthTotal || 0), 0);

  // Cumplimiento general
  const cumplimiento = presupuestoMes > 0
    ? Math.round((produccionMes / presupuestoMes) * 100)
    : 0;

  this.summaryKpis = { presupuestoMes, produccionMes, cumplimiento };
  this.animateSummaryKpis();
}

summaryKpis = { presupuestoMes: 0, produccionMes: 0, cumplimiento: 0 };
summaryAnimated: Record<string, number> = { presupuestoMes: 0, produccionMes: 0, cumplimiento: 0 };

private animateSummaryKpis(): void {
  Object.entries(this.summaryKpis).forEach(([key, target]) => {
    let current = 0;
    const inc   = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + inc, target);
      this.summaryAnimated[key] = Math.round(current);
      if (current >= target) clearInterval(timer);
      this.cdr.detectChanges();
    }, 30);
  });
}

  private animateKpis(kpis: any): void {
    const targets: Record<string, number> = {
      yesterdayTrips: kpis.yesterdayTrips,
      thisMonthTrips: kpis.thisMonthTrips,
      thisMonthTotal: kpis.thisMonthTotal,
      yesterdayBilling: kpis.yesterdayBilling,
    };
    Object.entries(targets).forEach(([key, target]) => {
      let current = 0;
      const inc = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        this.animatedValues[key] = Math.round(current);
        if (current >= target) clearInterval(timer);
        this.cdr.detectChanges();
      }, 30);
    });
  }

  formatMoney(v: number): string {
    if (v === undefined || v === null) return '$ 0';
    return '$ ' + v.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  getMonthVal(months: Record<number, number>, m: number): number {
    return months[m] || 0;
  }

  docStatusClass(status: string): string {
    return status === 'expired' ? 'badge-expired'
      : status === 'critical' ? 'badge-expired'
        : status === 'warning' ? 'badge-warning'
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
  // Temporal en el template, o en el .ts
  sumMonthValue(plates: any[], month: number): number {
  return plates.reduce((s, p) => s + (p.months[month] || 0), 0);
}

  // Meta por defecto 15M por placa, ajusta según tu negocio
  getPct(value: number, budget: number): number {
    if (!budget) return 0;
    return Math.min(Math.round((value / budget) * 100), 999);
  }

  getCircleDash(value: number, budget: number): string {
    const b = Number(budget);
    if (!b) return '0 100';
    const pct = Math.min((value / b) * 100, 100);
    return `${pct} ${100 - pct}`;
  }

  getCircleColor(value: number, budget: number): string {
    const b = Number(budget);
    if (!b) return '#94a3b8';
    const pct = (value / b) * 100;
    if (pct >= 100) return '#10b981';
    if (pct >= 70) return '#f59e0b';
    return '#ef4444';
  }

  activeTooltip: any = null;
  gridLines: { y: number; label: string }[] = [];
  linePath = '';
  areaPath = '';

  // Dimensiones del SVG
  private readonly CHART_W = 800;
  private readonly CHART_H = 200;
  private readonly PADDING_L = 45;
  private readonly PADDING_R = 20;
  private readonly PADDING_T = 15;
  private readonly PADDING_B = 20;

  private buildBars(billing: Record<number, number>, thisMonth: number): void {
    // Solo meses con datos O hasta el mes actual si es el año en curso
    const maxMonth = this.year === new Date().getFullYear() ? thisMonth : 12;

    const allMonths = Array.from({ length: maxMonth }, (_, i) => i + 1);
    const maxVal = Math.max(...allMonths.map(m => billing[m] || 0), 1);

    this.monthlyBillingBars = allMonths.map(m => ({
      label: MONTH_NAMES[m].substring(0, 3),
      value: billing[m] || 0,
      pct: Math.round(((billing[m] || 0) / maxVal) * 100),
      color: m === thisMonth ? '#1a6fdb' : '#10b981',
    }));

    this.buildLineChart(maxVal);
  }

  private buildLineChart(maxVal: number): void {
    const bars = this.monthlyBillingBars;
    const n = bars.length;
    if (!n) return;

    const w = this.CHART_W - this.PADDING_L - this.PADDING_R;
    const h = this.CHART_H - this.PADDING_T - this.PADDING_B;

    // Grid lines (4 niveles)
    this.gridLines = [0, 1, 2, 3, 4].map(i => {
      const val = (maxVal / 4) * (4 - i);
      const y = this.PADDING_T + (i / 4) * h;
      const millions = val / 1_000_000;
      return {
        y,
        label: millions >= 1 ? `${millions.toFixed(0)}M` : `${(val / 1000).toFixed(0)}K`
      };
    });

    // Puntos
    const points = bars.map((b, i) => ({
      x: this.getPointX(i),
      y: this.getPointY(b.value),
    }));

    // Path línea
    this.linePath = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');

    // Path área
    const first = points[0];
    const last = points[points.length - 1];
    const baseY = this.PADDING_T + h;
    this.areaPath = `M ${first.x} ${baseY} ` +
      points.map(p => `L ${p.x} ${p.y}`).join(' ') +
      ` L ${last.x} ${baseY} Z`;
  }

  getPointX(index: number): number {
    const n = this.monthlyBillingBars.length;
    const w = this.CHART_W - this.PADDING_L - this.PADDING_R;
    return this.PADDING_L + (index / Math.max(n - 1, 1)) * w;
  }

  getPointY(value: number): number {
    const bars = this.monthlyBillingBars;
    const maxVal = Math.max(...bars.map(b => b.value), 1);
    const h = this.CHART_H - this.PADDING_T - this.PADDING_B;
    return this.PADDING_T + (1 - value / maxVal) * h;
  }

  showTooltip(index: number, bar: any, event: MouseEvent): void {
    const rect = (event.target as SVGElement)
      .closest('.line-chart-wrap')!
      .getBoundingClientRect();
    const el = (event.target as SVGElement).getBoundingClientRect();

    this.activeTooltip = {
      index,
      label: bar.label,
      value: bar.value,
      x: el.left - rect.left - 50,
      y: el.top - rect.top - 70,
    };
  }

}