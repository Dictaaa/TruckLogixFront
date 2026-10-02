import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { AuthService } from '../../../../core/services/auth.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { SumPropPipe } from '../../../../shared/pipes/sum-prop.pipe';

type AccKey = 'produccion' | 'facturacion' | 'combustible' | 'mantenimiento' | 'pyg';

const MONTH_NAMES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, SumPropPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit, OnDestroy {

  private auth = inject(AuthService);
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  monthNames = MONTH_NAMES;
  year = new Date().getFullYear();
  yearOptions = [2024, 2025, 2026];

  affiliatesList: any[] = [];
  selectedAffiliate = '';

  isFuelRole = this.auth.hasRole([4]);

  // Datos del dashboard
  affiliates: any[] = [];
  activeMonths: number[] = [];
  thisMonth = new Date().getMonth() + 1;
  daysInMonth = 0;
  dayOfMonth = 0;
  daysRemaining = 0;

  kpis: any = null;
  monthlyBillingBars: { label: string; value: number; pct: number; color: string }[] = [];
  animatedValues: Record<string, number> = {
    yesterdayTrips: 0, thisMonthTrips: 0, thisMonthTotal: 0, yesterdayBilling: 0,
  };

  summaryKpis = { presupuestoMes: 0, produccionMes: 0, cumplimiento: 0 };
  summaryAnimated: Record<string, number> = { presupuestoMes: 0, produccionMes: 0, cumplimiento: 0 };

  // Combustible
  fuel: any = null;
  fuelAnimated: Record<string, number> = { totalGallons: 0, totalValue: 0, avgKmPerGallon: 0 };

  // Mantenimiento
  maintenance: any = null;
  mttoAnimated: Record<string, number> = { thisMonthTotal: 0, yearTotal: 0, thisMonthCount: 0 };
  mttoBars: { label: string; value: number; pct: number; current: boolean }[] = [];

  // Facturación
  billing: any = null;
  billingStatuses = [
    { key: 'pendiente_oc_temporal', label: 'Pendiente OC temporal',     color: '#64748b' },
    { key: 'pendiente_oc',          label: 'Pendiente orden de compra', color: '#f59e0b' },
    { key: 'pendiente_factura',     label: 'Pendiente factura',         color: '#1a6fdb' },
    { key: 'facturado',             label: 'Facturado',                 color: '#10b981' },
  ];

  private timers: any[] = [];

  // ─── ACORDEONES ───────────────────────────────────────────────────────────
  private readonly ACC_KEY = 'dashboard-acc';
  open: Record<AccKey, boolean> = this.loadAccState();

  toggle(key: AccKey): void {
    this.open[key] = !this.open[key];
    try { localStorage.setItem(this.ACC_KEY, JSON.stringify(this.open)); } catch { }
  }

  private loadAccState() {
    const def = { produccion: true, facturacion: true, combustible: true, mantenimiento: true, pyg: true };
    try {
      const saved = JSON.parse(localStorage.getItem(this.ACC_KEY) || '{}');
      return { ...def, ...saved };
    } catch { return def; }
  }

  get isAdmin(): boolean { return this.auth.hasRole([1]); }

  ngOnInit(): void {
    if (this.isAdmin) this.loadAffiliates();
    else if (this.auth.hasRole([3])) {
      this.selectedAffiliate = String(this.auth.getUser()?.company_id ?? '');
    }
    this.load();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliatesList = d;
    });
  }

  load(): void {
    this.loading = true;
    this.clearTimers();
    let url = `${ENDPOINTS.DASHBOARD.LIST}?year=${this.year}`;
    if (this.selectedAffiliate) url += `&affiliate_id=${this.selectedAffiliate}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        const maxMonth = this.maxMonth(res.thisMonth);
        this.affiliates = res.affiliates;
        this.activeMonths = Array.from({ length: maxMonth }, (_, i) => i + 1);
        this.thisMonth = res.thisMonth;
        this.daysInMonth = res.daysInMonth;
        this.dayOfMonth = res.dayOfMonth;
        this.daysRemaining = res.daysRemaining;
        this.kpis = res.kpis;

        this.buildSummaryKpis(res.affiliates, res.thisMonth);
        this.buildBars(res.kpis.monthlyBilling, res.thisMonth);
        this.animate(this.animatedValues, {
          yesterdayTrips: res.kpis.yesterdayTrips,
          thisMonthTrips: res.kpis.thisMonthTrips,
          thisMonthTotal: res.kpis.thisMonthTotal,
          yesterdayBilling: res.kpis.yesterdayBilling,
        });
        this.loadFuel(res.fuel);
        this.loadMaintenance(res.maintenance, res.thisMonth);
        this.billing = res.billing ?? null;

        // PYG: por defecto el mes actual (o diciembre si es un año anterior)
        const maxM = this.maxMonth(res.thisMonth);
        if (!this.pygMonth || this.pygMonth > maxM) this.pygMonth = maxM;
        this.loadPyg();

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private maxMonth(thisMonth: number): number {
    return Number(this.year) === new Date().getFullYear() ? thisMonth : 12;
  }

  // ─── ANIMACIÓN GENÉRICA ───────────────────────────────────────────────────
  private animate(
    target: Record<string, number>,
    values: Record<string, number>,
    decimals: Record<string, number> = {},
  ): void {
    Object.entries(values).forEach(([key, to]) => {
      const end = Number(to) || 0;
      const f = 10 ** (decimals[key] ?? 0);
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const cur = step >= 40 ? end : (end * step) / 40;
        target[key] = Math.round(cur * f) / f;
        if (step >= 40) clearInterval(timer);
        this.cdr.detectChanges();
      }, 30);
      this.timers.push(timer);
    });
  }

  private clearTimers(): void {
    this.timers.forEach(t => clearInterval(t));
    this.timers = [];
  }

  // ─── PRODUCCIÓN ───────────────────────────────────────────────────────────
  private buildSummaryKpis(affiliates: any[], thisMonth: number): void {
    const presupuestoMes = affiliates.reduce((s, aff) =>
      s + Number(aff.budgets?.[thisMonth] ?? aff.budgets?.[String(thisMonth)] ?? 0), 0);
    const produccionMes = affiliates.reduce((s, aff) => s + (aff.monthTotal || 0), 0);
    const cumplimiento = presupuestoMes > 0 ? Math.round((produccionMes / presupuestoMes) * 100) : 0;

    this.summaryKpis = { presupuestoMes, produccionMes, cumplimiento };
    this.animate(this.summaryAnimated, this.summaryKpis);
  }

  getCumplimientoColor(pct: number): string {
    if (pct >= 100) return '#10b981';
    if (pct >= 70) return '#f59e0b';
    return '#ef4444';
  }

  // ─── COMBUSTIBLE ──────────────────────────────────────────────────────────
  loadFuel(fuelData: any): void {
    if (!fuelData) return;
    this.fuel = fuelData;
    this.animate(this.fuelAnimated, {
      totalGallons: fuelData.kpis.totalGallons || 0,
      totalValue: fuelData.kpis.totalValue || 0,
      avgKmPerGallon: fuelData.kpis.avgKmPerGallon || 0,
    }, { totalGallons: 1, avgKmPerGallon: 1 });
  }

  getFuelMonth(p: any, m: number): any {
    return p?.months?.[m] ?? null;
  }

  getFuelRenderPct(kmPerGallon: number): number {
    if (!this.fuel?.byPlate?.length) return 0;
    const max = Math.max(...this.fuel.byPlate.map((p: any) => p.kmPerGallon), 1);
    return Math.round((kmPerGallon / max) * 100);
  }

  getFuelRenderColor(kmPerGallon: number): string {
    if (!this.fuel?.byPlate?.length) return '#94a3b8';
    const max = Math.max(...this.fuel.byPlate.map((p: any) => p.kmPerGallon), 1);
    const pct = (kmPerGallon / max) * 100;
    if (pct >= 80) return '#10b981';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  }

  getFuelRenderLabel(kmPerGallon: number): string {
    if (!this.fuel?.byPlate?.length) return '';
    const max = Math.max(...this.fuel.byPlate.map((p: any) => p.kmPerGallon), 1);
    const pct = (kmPerGallon / max) * 100;
    if (pct >= 80) return 'Bueno';
    if (pct >= 50) return 'Regular';
    return 'Bajo';
  }

  // ─── MANTENIMIENTO ────────────────────────────────────────────────────────
  loadMaintenance(data: any, thisMonth: number): void {
    if (!data) { this.maintenance = null; return; }
    this.maintenance = data;

    const months = Array.from({ length: this.maxMonth(thisMonth) }, (_, i) => i + 1);
    const maxVal = Math.max(...months.map(m => data.monthlyTotals?.[m] || 0), 1);
    this.mttoBars = months.map(m => ({
      label: MONTH_NAMES[m].substring(0, 3),
      value: data.monthlyTotals?.[m] || 0,
      pct: Math.round(((data.monthlyTotals?.[m] || 0) / maxVal) * 100),
      current: m === thisMonth && Number(this.year) === new Date().getFullYear(),
    }));

    this.animate(this.mttoAnimated, {
      thisMonthTotal: data.kpis.thisMonthTotal || 0,
      yearTotal: data.kpis.yearTotal || 0,
      thisMonthCount: data.kpis.thisMonthCount || 0,
    });
  }

  shortMoney(v: number): string {
    if (!v) return '';
    if (v >= 1_000_000) return `$ ${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$ ${(v / 1_000).toFixed(0)}K`;
    return `$ ${v.toFixed(0)}`;
  }

  trackById(_: number, a: any) { return a.id; }
  trackByPlate(_: number, p: any) { return p.plate; }

  // ─── FACTURACIÓN ───────────────────────────────────────────────────────────
  /** % que representa un valor dentro del total (para las barras) */
  sharePct(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  billingPctColor(pct: number | null): string {
    if (pct === null || pct === undefined) return '#94a3b8';
    if (pct >= 90) return '#10b981';
    if (pct >= 60) return '#f59e0b';
    return '#ef4444';
  }

  // ─── PYG ──────────────────────────────────────────────────────────────────
  pyg: any = null;
  pygLoading = false;
  pygError = false;
  pygMonth = 0;
  pygBlocks: { id: number; name: string; cols: any[]; total: any }[] = [];
  pygGeneral: { cols: any[]; total: any } | null = null;

  get pygMonthOptions(): number[] {
    return Array.from({ length: this.maxMonth(this.thisMonth) }, (_, i) => i + 1);
  }

  loadPyg(): void {
    if (this.isFuelRole || !this.pygMonth) return;
    this.pygLoading = true;
    this.pygError = false;
    let url = `${ENDPOINTS.DASHBOARD.PYG}?year=${this.year}&month=${this.pygMonth}`;
    if (this.selectedAffiliate) url += `&affiliate_id=${this.selectedAffiliate}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.pyg = res;
        // Vista precalculada: un bloque por afiliado (columnas = placas) + total general
        this.pygBlocks = (res.affiliates ?? []).map((a: any) => ({
          id: a.id,
          name: a.name,
          cols: a.vehicles.map((v: any) => ({ label: v.plate, d: v, v })),
          total: a.totals,
        }));
        this.pygGeneral = (res.affiliates?.length ?? 0) > 1
          ? { cols: res.affiliates.map((a: any) => ({ label: a.name, d: a.totals, v: null })), total: res.totals }
          : null;
        this.pygLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.pyg = null;
        this.pygLoading = false;
        this.pygError = true;
        this.cdr.detectChanges();
      },
    });
  }

  marginColor(pct: number | null): string {
    if (pct === null || pct === undefined) return '#94a3b8';
    if (pct >= 40) return '#10b981';
    if (pct >= 20) return '#f59e0b';
    return '#ef4444';
  }

  laboralesTitle(v: any): string {
    const d = v.detail;
    return `Salario ${this.formatMoney(d.salary)} + comisión ${d.commission_pct}% (${this.formatMoney(d.commission)})`;
  }

  provisionesTitle(v: any): string {
    const d = v.detail;
    return `(SOAT ${this.formatMoney(d.soat)} + Tecnomecánica ${this.formatMoney(d.tecnomecanica)}`
      + ` + Mtto anual ${this.formatMoney(d.annual_maintenance)}`
      + ` + Dotación ${this.formatMoney(d.dotacion)} × ${d.dotacion_times}) ÷ 12`;
  }

  // ─── UTILIDADES ───────────────────────────────────────────────────────────
  formatMoney(v: number): string {
    if (v === undefined || v === null) return '$ 0';
    return '$ ' + v.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  getMonthVal(months: Record<number, number>, m: number): number {
    return months?.[m] || 0;
  }

  docStatusClass(status: string): string {
    return status === 'expired' || status === 'critical' ? 'badge-expired'
      : status === 'warning' ? 'badge-warning'
        : 'badge-ok';
  }

  trackAffiliate(_: number, a: any) { return a.id; }

  sumMonthValue(plates: any[], month: number): number {
    return plates.reduce((s, p) => s + (p.months[month] || 0), 0);
  }

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

  // ─── GRÁFICA DE LÍNEA (producción) ────────────────────────────────────────
  activeTooltip: any = null;
  gridLines: { y: number; label: string }[] = [];
  linePath = '';
  areaPath = '';

  private readonly CHART_W = 800;
  private readonly CHART_H = 200;
  private readonly PADDING_L = 45;
  private readonly PADDING_R = 20;
  private readonly PADDING_T = 15;
  private readonly PADDING_B = 20;

  private buildBars(billing: Record<number, number>, thisMonth: number): void {
    const allMonths = Array.from({ length: this.maxMonth(thisMonth) }, (_, i) => i + 1);
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
    if (!bars.length) return;

    const h = this.CHART_H - this.PADDING_T - this.PADDING_B;

    this.gridLines = [0, 1, 2, 3, 4].map(i => {
      const val = (maxVal / 4) * (4 - i);
      const y = this.PADDING_T + (i / 4) * h;
      const millions = val / 1_000_000;
      return { y, label: millions >= 1 ? `${millions.toFixed(0)}M` : `${(val / 1000).toFixed(0)}K` };
    });

    const points = bars.map((b, i) => ({ x: this.getPointX(i), y: this.getPointY(b.value) }));

    this.linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

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
    const maxVal = Math.max(...this.monthlyBillingBars.map(b => b.value), 1);
    const h = this.CHART_H - this.PADDING_T - this.PADDING_B;
    return this.PADDING_T + (1 - value / maxVal) * h;
  }

  showTooltip(index: number, bar: any, event: MouseEvent): void {
    const rect = (event.target as SVGElement).closest('.line-chart-wrap')!.getBoundingClientRect();
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