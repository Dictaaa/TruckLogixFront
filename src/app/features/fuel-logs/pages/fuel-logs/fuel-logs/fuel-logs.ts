import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../../../../../core/services/api/api.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role';
import { AuthService } from '../../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataTableComponent, TableColumn, TablePage } from '../../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../../core/components/filter-panel/filter-panel';
import { FuelLogFormModal } from '../../../modals/fuel-log-form-modal/fuel-log-form-modal/fuel-log-form-modal';

type AutoKey = 'vehicle_id' | 'affiliate_id';

interface AutoFilter {
  ctrl: FormControl;
  field: string;
  all: any[];
  filtered$: Observable<any[]>;
}

@Component({
  selector: 'app-fuel-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent, FilterPanelComponent, MatAutocompleteModule],
  templateUrl: './fuel-logs.html',
  styleUrls: ['./fuel-logs.scss'],
})
export class FuelLogs implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading  = true;
  total    = 0;
  logs: any[] = [];
  private rawLogs: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: 'fecha', sortDir: 'desc'
  };

  // ── Panel de filtros ──────────────────────────────────────────────────
  filterOpen = false;
  activeFilterCount = 0;

  /** El afiliado (rol 3) solo ve lo suyo: no necesita filtro de afiliado */
  isAffiliate = this.auth.hasRole([3]);

  filters = this.emptyFilters();

  ac: Record<AutoKey, AutoFilter> = {
    vehicle_id:   this.newAuto('plate'),
    affiliate_id: this.newAuto('name'),
  };

  columns: TableColumn[] = [
    { key: 'fecha',          label: 'Fecha',           format: 'date',     sortable: true  },
    { key: 'placa',          label: 'Placa',           format: 'placa'                     },
    { key: 'afiliado',       label: 'Afiliado',                            sortable: true  },
    { key: 'kmInicial',      label: 'Km Inicial',                          sortable: true  },
    { key: 'kmFinal',        label: 'Km Final',                            sortable: true  },
    { key: 'kmRecorrido',    label: 'Km Recorrido',                        sortable: true  },
    { key: 'galones',        label: 'Galones',                             sortable: true  },
    { key: 'precioPorGalon', label: 'Precio/Galón',    format: 'currency', sortable: true  },
    { key: 'totalValor',     label: 'Total',           format: 'currency', sortable: true  },
    { key: 'observaciones',  label: 'Observaciones'                                        },
  ];

  get actions() {
    const base: any[] = [];
    if (this.auth.hasRole([1, 2])) base.push({ label: 'Editar',   action: 'edit' });
    if (this.auth.hasRole([1]))    base.push({ label: 'Eliminar', action: 'delete', danger: true });
    return base;
  }

  ngOnInit(): void {
    this.loadFilterCatalogs();
  }

  // ── Tabla ─────────────────────────────────────────────────────────────
  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.load(params);
  }

  load(params: TablePage): void {
    this.loading = true;

    let url = `${ENDPOINTS.FUEL_LOGS.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    Object.entries(this.filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url += `&${k}=${encodeURIComponent(String(v))}`;
    });

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawLogs = res.data;
        this.total   = res.total;
        this.logs    = res.data.map((l: any) => this.mapLog(l));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private mapLog(l: any): any {
    return {
      id:            l.id,
      fecha:         l.fuel_date,
      placa:         l.vehicle?.plate          || '',
      afiliado:      l.affiliate?.name         || '',
      kmInicial:     Number(l.km_initial       || 0),
      kmFinal:       Number(l.km_final         || 0),
      kmRecorrido:   Number(l.km_driven        || 0),
      galones:       Number(l.gallons          || 0),
      precioPorGalon:Number(l.price_per_gallon || 0),
      totalValor:    Number(l.total_value      || 0),
      observaciones: l.observations            || '',
    };
  }

  // ── Filtros ───────────────────────────────────────────────────────────
  private emptyFilters() {
    return {
      fecha_desde:  '',
      fecha_hasta:  '',
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

  private loadFilterCatalogs(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => this.bindAuto('vehicle_id', d));
    if (!this.isAffiliate) {
      this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => this.bindAuto('affiliate_id', d));
    }
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
    this.load(this.lastParams);
    this.filterOpen = false;
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();
    (Object.keys(this.ac) as AutoKey[]).forEach(k => this.ac[k].ctrl.setValue('', { emitEvent: false }));
    this.activeFilterCount = 0;
    this.lastParams = { ...this.lastParams, page: 1 };
    this.load(this.lastParams);
    this.filterOpen = false;
  }

  // ── Acciones ──────────────────────────────────────────────────────────
  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(row: any): void {
    const raw = this.rawLogs.find(l => String(l.id) === String(row.id));
    if (!raw) return;
    const ref = this.dialog.open(FuelLogFormModal, {
      data: raw, panelClass: 'dialog-panel', width: '700px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar el registro #${row.id}?`)) return;
    this.api.deleteAuth(ENDPOINTS.FUEL_LOGS.DELETE(row.id)).subscribe({
      next: () => {
        this.toast.success('Registro eliminado');
        setTimeout(() => this.load(this.lastParams));
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(FuelLogFormModal, {
      data: null, panelClass: 'dialog-panel', width: '700px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }
}