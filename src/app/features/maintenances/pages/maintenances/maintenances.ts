import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api/api.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../core/components/filter-panel/filter-panel';
import { MaintenanceFormModalComponent } from '../../modals/maintenance-form-modal/maintenance-form-modal';

type AutoKey = 'vehicle_id' | 'affiliate_id' | 'brand_id' | 'maintenance_type_id' | 'trailer_plate_id';

interface AutoFilter {
  ctrl: FormControl;
  field: string;              // propiedad que se muestra (name / plate)
  all: any[];
  filtered$: Observable<any[]>;
}

@Component({
  selector: 'app-maintenances',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent, FilterPanelComponent, MatAutocompleteModule],
  templateUrl: './maintenances.html',
  styleUrls: ['./maintenances.scss'],
})
export class MaintenancesComponent implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading  = true;
  total    = 0;
  records: any[] = [];
  private rawRecords: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: 'fechaIngreso', sortDir: 'desc'
  };

  // ── Panel de filtros ──────────────────────────────────────────────────
  filterOpen = false;
  activeFilterCount = 0;

  /** El afiliado (rol 3) solo ve lo suyo, no necesita filtrar por afiliado */
  isAffiliate = this.auth.hasRole([3]);

  estadoOptions = [
    { value: 'abierto', label: 'En taller (sin fecha de salida)' },
    { value: 'cerrado', label: 'Finalizado' },
  ];

  filters = this.emptyFilters();

  ac: Record<AutoKey, AutoFilter> = {
    vehicle_id:          this.newAuto('plate'),
    affiliate_id:        this.newAuto('name'),
    brand_id:            this.newAuto('name'),
    maintenance_type_id: this.newAuto('name'),
    trailer_plate_id:    this.newAuto('plate'),
  };

  columns: TableColumn[] = [
    { key: 'fechaIngreso',  label: 'F. Ingreso',          format: 'date',     sortable: true },
    { key: 'fechaSalida',   label: 'F. Salida',           format: 'date',     sortable: true },
    { key: 'marca',         label: 'Marca',                                   sortable: true },
    { key: 'placa',         label: 'Placa',               format: 'placa' },
    { key: 'placaTrailer',  label: 'Placa Trailer' },
    { key: 'afiliado',      label: 'Afiliado',                                sortable: true },
    { key: 'tipoMtto',      label: 'Tipo MTTO',                               sortable: true },
    { key: 'operacion',     label: 'Operación en Taller' },
    { key: 'costoManoObra', label: 'Mano de Obra',        format: 'currency', sortable: true },
    { key: 'costoRepuesto', label: 'Repuestos',           format: 'currency', sortable: true },
    { key: 'totalCosto',    label: 'Total',               format: 'currency', sortable: true },
  ];

  get actions() {
    const base: any[] = [];
    if (this.auth.hasRole([1, 2, 4])) base.push({ label: 'Editar',   action: 'edit' });
    if (this.auth.hasRole([1]))       base.push({ label: 'Eliminar', action: 'delete', danger: true });
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

    let url = `${ENDPOINTS.MAINTENANCES.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    // Filtros del panel
    Object.entries(this.filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) url += `&${k}=${encodeURIComponent(String(v))}`;
    });

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawRecords = res.data;
        this.total      = res.total;
        this.records    = res.data.map((r: any) => this.mapRecord(r));
        this.loading    = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private mapRecord(r: any): any {
    return {
      id:            r.id,
      fechaIngreso:  r.entry_date,
      fechaSalida:   r.exit_date || '',
      marca:         r.brand?.name || '',
      placa:         r.vehicle?.plate || '',
      placaTrailer:  r.trailerPlate?.plate || '',   // viene del include 'trailerPlate'
      afiliado:      r.affiliate?.name || '',
      tipoMtto:      r.maintenanceType?.name || '',
      operacion:     r.operation_detail || '',
      costoManoObra: Number(r.labor_cost || 0),
      costoRepuesto: Number(r.parts_cost || 0),
      totalCosto:    Number(r.total_cost ?? (Number(r.labor_cost || 0) + Number(r.parts_cost || 0))),
    };
  }

  // ── Filtros ───────────────────────────────────────────────────────────
  private emptyFilters() {
    return {
      fecha_desde: '',
      fecha_hasta: '',
      estado: '',
      vehicle_id: '' as string | number,
      affiliate_id: '' as string | number,
      brand_id: '' as string | number,
      maintenance_type_id: '' as string | number,
      trailer_plate_id: '' as string | number,
    };
  }

  private newAuto(field: string): AutoFilter {
    return { ctrl: new FormControl(''), field, all: [], filtered$: of([]) };
  }

  /** Conecta un autocomplete a su catálogo y limpia el filtro si el usuario escribe a mano */
  private bindAuto(key: AutoKey, data: any[]): void {
    const a = this.ac[key];
    a.all = Array.isArray(data) ? data : (data as any)?.data ?? [];
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
    // ⚠ Ajusta estos nombres a como los tengas en endpoints.ts (son los que usa el modal)
    this.api.getAuth(ENDPOINTS.MAINTENANCES.BRANDS).subscribe((d: any) => this.bindAuto('brand_id', d));
    this.api.getAuth(ENDPOINTS.MAINTENANCES.TYPES).subscribe((d: any) => this.bindAuto('maintenance_type_id', d));
    this.api.getAuth(ENDPOINTS.MAINTENANCES.TRAILER_PLATES).subscribe((d: any) => this.bindAuto('trailer_plate_id', d));
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
    const raw = this.rawRecords.find(r => String(r.id) === String(row.id));
    if (!raw) return;
    const ref = this.dialog.open(MaintenanceFormModalComponent, {
      data: raw, panelClass: 'dialog-panel', width: '860px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar el registro #${row.id}?`)) return;
    this.api.deleteAuth(ENDPOINTS.MAINTENANCES.DELETE(row.id)).subscribe({
      next: () => {
        this.toast.success('Registro eliminado');
        setTimeout(() => this.load(this.lastParams));
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(MaintenanceFormModalComponent, {
      data: null, panelClass: 'dialog-panel', width: '860px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }
}