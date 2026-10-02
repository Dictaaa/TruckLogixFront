import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { AuthService } from '../../../../core/services/auth.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../core/components/filter-panel/filter-panel';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDowntimeFormModal } from '../../modals/vehicle-downtime-form-modal/vehicle-downtime-form-modal';

type AutoKey = 'vehicle_id' | 'affiliate_id';

interface AutoFilter {
  ctrl: FormControl;
  field: string;
  all: any[];
  filtered$: Observable<any[]>;
}

@Component({
  selector: 'app-vehicle-downtime',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, FilterPanelComponent, MatAutocompleteModule],
  templateUrl: './vehicle-downtime.html',
  styleUrls: ['./vehicle-downtime.scss'],
})
export class VehicleDowntime implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);
  private auth   = inject(AuthService);

  /** Afiliado (rol 3): solo consulta los registros de sus placas */
  isAffiliate = this.auth.hasRole([3]);

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  activeTab: 'suggestions' | 'records' = this.isAffiliate ? 'records' : 'suggestions';

  // ─── Rango para sugerencias ────────────────────────────────────────────────
  fechaDesde = '';
  fechaHasta = '';

  // ─── Sugerencias ──────────────────────────────────────────────────────────
  suggestions:      any[] = [];
  loadingSuggestions = false;
  statuses:         any[] = [];

  // ─── Registros guardados ───────────────────────────────────────────────────
  records:  any[] = [];
  total     = 0;
  loading   = false;

  private lastParams: TablePage = {
    page: 1, limit: 20, search: '', column: '', sortBy: 'fecha', sortDir: 'desc'
  };

  // ─── Panel de filtros (registros guardados) ───────────────────────────────
  filterOpen = false;
  activeFilterCount = 0;
  filters = this.emptyFilters();

  ac: Record<AutoKey, AutoFilter> = {
    vehicle_id:   this.newAuto('plate'),
    affiliate_id: this.newAuto('name'),
  };

  columns: TableColumn[] = [
    { key: 'fecha',    label: 'Fecha',    format: 'date', sortable: true },
    { key: 'placa',    label: 'Placa',    format: 'placa'               },
    { key: 'afiliado', label: 'Afiliado',                sortable: true },
    { key: 'estado',   label: 'Estado',                  sortable: true },
    { key: 'obs',      label: 'Observación'                             },
    { key: 'taller',   label: 'Mantenimiento'                           },
  ];

  get actions() {
    if (this.isAffiliate) return [];
    return [
      { label: 'Editar',   action: 'edit'   },
      { label: 'Eliminar', action: 'delete', danger: true },
    ];
  }

  ngOnInit(): void {
    this.loadStatuses();
    this.loadFilterCatalogs();

    if (this.isAffiliate) {
      this.loadRecords(this.lastParams);
    } else {
      this.loadSuggestions();
    }
  }

  // ─── CATÁLOGOS ────────────────────────────────────────────────────────────
  loadStatuses(): void {
    this.api.getAuth(ENDPOINTS.VEHICLE_DOWNTIME.STATUSES).subscribe((d: any) => {
      this.statuses = Array.isArray(d) ? d : [];
      this.cdr.detectChanges();
    });
  }

  private loadFilterCatalogs(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => this.bindAuto('vehicle_id', d));
    if (!this.isAffiliate) {
      this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => this.bindAuto('affiliate_id', d));
    }
  }

  // ─── SUGERENCIAS ──────────────────────────────────────────────────────────
  private mapSuggestion(s: any): any {
    return {
      ...s,
      selectedStatusId: s.maintenance_id
        ? this.statuses.find((st: any) => st.name.toLowerCase().includes('taller'))?.id || null
        : null,
      observations: '',
      saving: false,
    };
  }

  loadSuggestions(): void {
    if (this.isAffiliate) return;
    this.loadingSuggestions = true;
    const today = new Date();
    const desde = new Date(today);
    desde.setDate(desde.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().substring(0, 10);

    const url = `${ENDPOINTS.VEHICLE_DOWNTIME.SUGGESTIONS}?fecha_desde=${fmt(desde)}&fecha_hasta=${fmt(today)}`;
    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.suggestions = res.suggestions.map((s: any) => this.mapSuggestion(s));
        this.loadingSuggestions = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingSuggestions = false; }
    });
  }

  consultSuggestions(): void {
    if (this.isAffiliate) return;
    if (!this.fechaDesde || !this.fechaHasta) {
      this.toast.error('Seleccioná el rango de fechas');
      return;
    }
    this.loadingSuggestions = true;
    const url = `${ENDPOINTS.VEHICLE_DOWNTIME.SUGGESTIONS}?fecha_desde=${this.fechaDesde}&fecha_hasta=${this.fechaHasta}`;
    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.suggestions = res.suggestions.map((s: any) => this.mapSuggestion(s));
        this.loadingSuggestions = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingSuggestions = false; }
    });
  }

  saveSuggestion(s: any): void {
    if (this.isAffiliate) return;
    if (!s.selectedStatusId) {
      this.toast.error('Seleccioná un estado');
      return;
    }
    s.saving = true;
    const payload = {
      vehicle_id:     s.vehicle_id,
      affiliate_id:   s.affiliate_id,
      downtime_date:  s.downtime_date,
      status_id:      s.selectedStatusId,
      maintenance_id: s.maintenance_id || null,
      observations:   s.observations   || null,
    };
    this.api.postAuth(ENDPOINTS.VEHICLE_DOWNTIME.FROM_SUGGESTION, payload).subscribe({
      next: () => {
        this.toast.success('Registro guardado');
        this.suggestions = this.suggestions.filter(x =>
          !(x.vehicle_id === s.vehicle_id && x.downtime_date === s.downtime_date)
        );
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toast.error(err?.error?.error || 'Error al guardar');
        s.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ─── REGISTROS GUARDADOS ──────────────────────────────────────────────────
  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.loadRecords(params);
  }

  loadRecords(params: TablePage): void {
    this.loading = true;
    let url = `${ENDPOINTS.VEHICLE_DOWNTIME.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    Object.entries(this.filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url += `&${k}=${encodeURIComponent(String(v))}`;
    });

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.total   = res.total;
        this.records = res.data.map((r: any) => ({
          id:       r.id,
          fecha:    r.downtime_date,
          placa:    r.vehicle?.plate    || '',
          afiliado: r.affiliate?.name   || '',
          estado:   r.status?.name      || '',
          obs:      r.observations      || '',
          taller:   r.maintenance ? `Mtto #${r.maintenance.id}` : '',
          _raw:     r,
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  // ─── FILTROS ──────────────────────────────────────────────────────────────
  private emptyFilters() {
    return {
      fecha_desde:  '',
      fecha_hasta:  '',
      status_id:    '' as string | number,
      vehicle_id:   '' as string | number,
      affiliate_id: '' as string | number,
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

  onSelect(key: AutoKey, item: any): void {
    this.filters[key] = item?.id ?? '';
  }

  displayFn(field: string) {
    return (item: any): string => item ? (item[field] ?? '') : '';
  }

  applyFilters(): void {
    this.activeFilterCount = Object.values(this.filters).filter(v => v !== '').length;
    this.lastParams = { ...this.lastParams, page: 1 };
    this.activeTab = 'records';
    this.loadRecords(this.lastParams);
    this.filterOpen = false;
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();
    (Object.keys(this.ac) as AutoKey[]).forEach(k => this.ac[k].ctrl.setValue('', { emitEvent: false }));
    this.activeFilterCount = 0;
    this.lastParams = { ...this.lastParams, page: 1 };
    this.loadRecords(this.lastParams);
    this.filterOpen = false;
  }

  // ─── ACCIONES ─────────────────────────────────────────────────────────────
  onAction(event: { action: string; row: any }): void {
    if (this.isAffiliate) return;
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(row: any): void {
    const ref = this.dialog.open(VehicleDowntimeFormModal, {
      data: { record: row._raw, statuses: this.statuses },
      panelClass: 'dialog-panel',
      width: '520px',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.loadRecords(this.lastParams); });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar el registro de ${row.placa} del ${row.fecha}?`)) return;
    this.api.deleteAuth(ENDPOINTS.VEHICLE_DOWNTIME.DELETE(row.id)).subscribe({
      next: () => { this.toast.success('Eliminado'); this.loadRecords(this.lastParams); },
      error: () => this.toast.error('Error al eliminar'),
    });
  }

  openCreateModal(): void {
    if (this.isAffiliate) return;
    const ref = this.dialog.open(VehicleDowntimeFormModal, {
      data: { record: null, statuses: this.statuses },
      panelClass: 'dialog-panel',
      width: '520px',
    });
    ref.afterClosed().subscribe(r => {
      if (r?.saved) {
        this.loadRecords(this.lastParams);
        if (this.suggestions.length) this.consultSuggestions();
      }
    });
  }

  setTab(tab: 'suggestions' | 'records'): void {
    if (this.isAffiliate && tab === 'suggestions') return;
    this.activeTab = tab;
    if (tab === 'records' && this.records.length === 0) {
      this.loadRecords(this.lastParams);
    }
  }

  getStatusName(id: number): string {
    return this.statuses.find(s => s.id === id)?.name || '';
  }
}