import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { AuthService } from '../../../../core/services/auth.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { FilterPanelComponent } from '../../../../core/components/filter-panel/filter-panel';
import { BillingActionModal, BillingMode } from '../../modals/billing-action-modal/billing-action-modal';
import { BillingHistoryModal } from '../../modals/billing-history-modal/billing-history-modal';

export type BillingStatus = 'pendiente_oc_temporal' | 'pendiente_oc' | 'pendiente_factura' | 'facturado';
type Tab = BillingStatus | 'todos';
type AutoKey = 'affiliate_id' | 'client_id' | 'vehicle_id' | 'container_id';

interface AutoFilter {
  ctrl: FormControl;
  field: string;
  all: any[];
  filtered$: Observable<any[]>;
}

@Component({
  selector: 'app-billing',
  standalone: true,
  // HasRoleDirective es necesaria para *appHasRole en el HTML (botón Revertir)
  imports: [CommonModule, FormsModule, FilterPanelComponent, MatAutocompleteModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class BillingComponent implements OnInit, OnDestroy {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);
  private auth   = inject(AuthService);

  /** Afiliado (rol 3): solo consulta sus viajes, sin selección ni acciones */
  isAffiliate = this.auth.hasRole([3]);

  // ── Pestañas por estado ───────────────────────────────────────────────
  tabs: { key: Tab; label: string }[] = [
    { key: 'pendiente_oc_temporal', label: 'Pendiente OC temporal' },
    { key: 'pendiente_oc',          label: 'Pendiente orden de compra' },
    { key: 'pendiente_factura',     label: 'Pendiente factura' },
    { key: 'facturado',             label: 'Facturado' },
    { key: 'todos',                 label: 'Todos' },
  ];
  activeTab: Tab = 'pendiente_oc_temporal';

  statusLabels: Record<string, string> = {
    pendiente_oc_temporal: 'Pendiente OC temporal',
    pendiente_oc:          'Pendiente OC',
    pendiente_factura:     'Pendiente factura',
    facturado:             'Facturado',
  };

  summary: Record<string, { trips: number; value: number }> = {};

  // ── Tabla ─────────────────────────────────────────────────────────────
  rows: any[] = [];
  total = 0;
  page = 1;
  limit = 20;
  totalPages = 1;
  loading = true;
  sortBy = 'fecha';
  sortDir: 'asc' | 'desc' = 'desc';
  limitOptions = [20, 50, 100];

  search = '';
  private search$ = new Subject<string>();

  // ★ NUEVO ── Búsqueda por columna ─────────────────────────────────────
  searchColumn = '';
  searchColumns = [
    { key: '',            label: 'Todas las columnas' },
    { key: 'placa',       label: 'Placa' },
    { key: 'contenedor',  label: 'Contenedor' },
    { key: 'cliente',     label: 'Cliente' },
    { key: 'afiliado',    label: 'Afiliado' },
    { key: 'ocTemporal',  label: 'OC temporal' },
    { key: 'ordenCompra', label: 'Orden de compra' },
    { key: 'factura',     label: 'Factura' },
  ].filter(c => !(this.isAffiliate && c.key === 'afiliado'));   // el afiliado no busca por afiliado

  get searchPlaceholder(): string {
    const col = this.searchColumns.find(c => c.key === this.searchColumn);
    return this.searchColumn ? `Buscar por ${col?.label.toLowerCase()}…` : 'Buscar en todas las columnas…';
  }

  onSearchColumnChange(): void {
    // Solo recarga si ya hay texto escrito
    if (this.search.trim()) {
      this.page = 1;
      this.clearSelection();
      this.load();
    }
  }
  // ★ FIN NUEVO ─────────────────────────────────────────────────────────

  // ── Selección (persiste entre páginas) ────────────────────────────────
  /** id → valor del flete */
  selected = new Map<number, number>();
  selectingAll = false;

  // ── Panel de filtros ──────────────────────────────────────────────────
  filterOpen = false;
  activeFilterCount = 0;
  filters = this.emptyFilters();
  tempOrders: any[] = [];

  ac: Record<AutoKey, AutoFilter> = {
    affiliate_id: this.newAuto('name'),
    client_id:    this.newAuto('name'),
    vehicle_id:   this.newAuto('plate'),
    container_id: this.newAuto('number'),
  };

  ngOnInit(): void {
    this.search$.pipe(debounceTime(400)).subscribe(() => {
      this.page = 1;
      this.clearSelection();
      this.load();
    });
    this.loadFilterCatalogs();
    this.loadTempOrders();
    this.loadSummary();
    this.load();
  }

  ngOnDestroy(): void {
    this.search$.complete();
  }

  // ═══ CARGA ═══════════════════════════════════════════════════════════
  private filterQuery(): string {
    let q = '';
    Object.entries(this.filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) q += `&${k}=${encodeURIComponent(String(v))}`;
    });
    // ★ NUEVO: envía también la columna elegida
    if (this.search.trim()) {
      q += `&search=${encodeURIComponent(this.search.trim())}`;
      if (this.searchColumn) q += `&column=${this.searchColumn}`;
    }
    if (this.activeTab !== 'todos') q += `&status=${this.activeTab}`;
    return q;
  }

  load(): void {
    this.loading = true;
    const url = `${ENDPOINTS.BILLING.TRIPS}?page=${this.page}&limit=${this.limit}`
      + `&sortBy=${this.sortBy}&sortDir=${this.sortDir}` + this.filterQuery();

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.rows = res.data ?? [];
        this.total = res.total ?? 0;
        this.totalPages = Math.max(res.totalPages ?? 1, 1);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  loadSummary(): void {
    let q = '';
    if (this.filters.fecha_desde)  q += `&fecha_desde=${this.filters.fecha_desde}`;
    if (this.filters.fecha_hasta)  q += `&fecha_hasta=${this.filters.fecha_hasta}`;
    if (this.filters.affiliate_id) q += `&affiliate_id=${this.filters.affiliate_id}`;
    this.api.getAuth(`${ENDPOINTS.BILLING.SUMMARY}?${q.substring(1)}`).subscribe((res: any) => {
      this.summary = {};
      (res?.byStatus ?? []).forEach((s: any) => this.summary[s.status] = { trips: s.trips, value: s.value });
      this.cdr.detectChanges();
    });
  }

  loadTempOrders(): void {
    this.api.getAuth(ENDPOINTS.BILLING.TEMP_ORDERS).subscribe((res: any) => {
      this.tempOrders = Array.isArray(res) ? res : [];
      this.cdr.detectChanges();
    });
  }

  refreshAll(): void {
    this.clearSelection();
    this.load();
    this.loadSummary();
    this.loadTempOrders();
  }

  // ═══ PESTAÑAS / ORDEN / PAGINACIÓN ═══════════════════════════════════
  setTab(tab: Tab): void {
    if (this.activeTab === tab) return;
    this.activeTab = tab;
    this.page = 1;
    this.clearSelection();
    this.load();
  }

  onSearch(value: string): void {
    this.search = value;
    this.search$.next(value);
  }

  sort(col: string): void {
    if (this.sortBy === col) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    else { this.sortBy = col; this.sortDir = col === 'fecha' ? 'desc' : 'asc'; }
    this.load();
  }

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.page) return;
    this.page = page;
    this.load();
  }

  onLimitChange(): void {
    this.page = 1;
    this.load();
  }

  get pageFrom(): number { return this.total ? (this.page - 1) * this.limit + 1 : 0; }
  get pageTo(): number { return Math.min(this.page * this.limit, this.total); }

  // ═══ SELECCIÓN ═══════════════════════════════════════════════════════
  isSelected(id: number): boolean { return this.selected.has(id); }

  toggle(row: any): void {
    if (this.isAffiliate) return;
    if (this.selected.has(row.id)) this.selected.delete(row.id);
    else this.selected.set(row.id, Number(row.freight_value || 0));
  }

  get pageAllSelected(): boolean {
    return this.rows.length > 0 && this.rows.every(r => this.selected.has(r.id));
  }

  get pageSomeSelected(): boolean {
    return !this.pageAllSelected && this.rows.some(r => this.selected.has(r.id));
  }

  togglePage(): void {
    if (this.isAffiliate) return;
    if (this.pageAllSelected) this.rows.forEach(r => this.selected.delete(r.id));
    else this.rows.forEach(r => this.selected.set(r.id, Number(r.freight_value || 0)));
  }

  /** Selecciona todos los viajes que cumplen el filtro actual (todas las páginas) */
  selectAllFiltered(): void {
    this.selectingAll = true;
    this.api.getAuth(`${ENDPOINTS.BILLING.TRIPS}?ids_only=1${this.filterQuery()}`).subscribe({
      next: (res: any) => {
        (res?.items ?? []).forEach((i: any) => this.selected.set(i.id, Number(i.freight_value || 0)));
        if ((res?.total ?? 0) >= 5000) this.toast.error('Se seleccionaron los primeros 5.000 viajes');
        this.selectingAll = false;
        this.cdr.detectChanges();
      },
      error: () => { this.selectingAll = false; this.toast.error('No se pudo seleccionar'); },
    });
  }

  clearSelection(): void { this.selected.clear(); }

  get selectedCount(): number { return this.selected.size; }
  get selectedValue(): number {
    let s = 0;
    this.selected.forEach(v => s += v);
    return s;
  }

  // ═══ ACCIONES ════════════════════════════════════════════════════════
  /** Acción principal sugerida según la pestaña */
  get primaryMode(): BillingMode | null {
    switch (this.activeTab) {
      case 'pendiente_oc_temporal': return 'temp';
      case 'pendiente_oc':          return 'po';
      case 'pendiente_factura':     return 'invoice';
      default:                      return null;
    }
  }

  openAction(mode: BillingMode): void {
    if (!this.selectedCount) {
      this.toast.error('Selecciona al menos un viaje');
      return;
    }
    const ref = this.dialog.open(BillingActionModal, {
      data: {
        mode,
        tripIds: [...this.selected.keys()],
        count: this.selectedCount,
        value: this.selectedValue,
      },
      width: '720px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.refreshAll()); });
  }

  openHistory(row: any): void {
    this.dialog.open(BillingHistoryModal, {
      data: { trip: row },
      width: '640px',
      maxHeight: '90vh',
    });
  }

  // ═══ FILTROS ═════════════════════════════════════════════════════════
  private emptyFilters() {
    return {
      fecha_desde:    '',
      fecha_hasta:    '',
      affiliate_id:   '' as string | number,
      client_id:      '' as string | number,
      vehicle_id:     '' as string | number,
      container_id:   '' as string | number,
      temp_order_id:  '' as string | number,
      purchase_order: '',
      invoice_number: '',
    };
  }

  private newAuto(field: string): AutoFilter {
    return { ctrl: new FormControl(''), field, all: [], filtered$: of([]) };
  }

  private bindAuto(key: AutoKey, data: any): void {
    const a = this.ac[key];
    a.all = Array.isArray(data) ? data : data?.data ?? [];
    a.filtered$ = a.ctrl.valueChanges.pipe(
      startWith(''),
      map(v => {
        const q = (typeof v === 'string' ? v : '').toLowerCase();
        return q ? a.all.filter(x => String(x[a.field] ?? '').toLowerCase().includes(q)) : a.all.slice();
      })
    );
    a.ctrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters[key] = '';
    });
    this.cdr.detectChanges();
  }

  private loadFilterCatalogs(): void {
    if (!this.isAffiliate) {
      this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => this.bindAuto('affiliate_id', d));
    }
    this.api.getAuth(ENDPOINTS.CLIENTS.LIST).subscribe((d: any) => this.bindAuto('client_id', d));
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => this.bindAuto('vehicle_id', d));
    this.api.getAuth(ENDPOINTS.CONTAINERS.LIST).subscribe((d: any) => this.bindAuto('container_id', d));
  }

  onSelect(key: AutoKey, item: any): void {
    this.filters[key] = item?.id ?? '';
  }

  displayFn(field: string) {
    return (item: any): string => item ? (item[field] ?? '') : '';
  }

  applyFilters(): void {
    this.activeFilterCount = Object.values(this.filters).filter(v => v !== '' && v !== null).length;
    this.page = 1;
    this.clearSelection();
    this.load();
    this.loadSummary();
    this.filterOpen = false;
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();
    (Object.keys(this.ac) as AutoKey[]).forEach(k => this.ac[k].ctrl.setValue('', { emitEvent: false }));
    this.activeFilterCount = 0;
    this.page = 1;
    this.clearSelection();
    this.load();
    this.loadSummary();
    this.filterOpen = false;
  }

  // ═══ FORMATO ═════════════════════════════════════════════════════════
  formatMoney(v: number): string {
    return '$ ' + Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  statusClass(s: string): string {
    return {
      pendiente_oc_temporal: 'st-temp',
      pendiente_oc:          'st-oc',
      pendiente_factura:     'st-fact',
      facturado:             'st-done',
    }[s] ?? '';
  }

  /** Columnas de la tabla (para el colspan de cargando / vacío) */
  get colCount(): number { return this.isAffiliate ? 11 : 12; }

  trackById(_: number, r: any) { return r.id; }
}