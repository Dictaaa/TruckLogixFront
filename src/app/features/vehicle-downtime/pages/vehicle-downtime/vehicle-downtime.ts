import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';
import { MatDialog } from '@angular/material/dialog';
import { VehicleDowntimeFormModal } from '../../modals/vehicle-downtime-form-modal/vehicle-downtime-form-modal';

@Component({
  selector: 'app-vehicle-downtime',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent],
  templateUrl: './vehicle-downtime.html',
  styleUrls: ['./vehicle-downtime.scss'],
})
export class VehicleDowntime implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  activeTab: 'suggestions' | 'records' = 'suggestions';

  // ─── Filtro de rango ───────────────────────────────────────────────────────
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

  columns: TableColumn[] = [
    { key: 'fecha',    label: 'Fecha',    format: 'date', sortable: true },
    { key: 'placa',    label: 'Placa',    format: 'placa'               },
    { key: 'afiliado', label: 'Afiliado',                sortable: true },
    { key: 'estado',   label: 'Estado',                  sortable: true },
    { key: 'obs',      label: 'Observación'                             },
    { key: 'taller',   label: 'Mantenimiento'                           },
  ];

  get actions() {
    return [
      { label: 'Editar',   action: 'edit'   },
      { label: 'Eliminar', action: 'delete', danger: true },
    ];
  }

  ngOnInit(): void {
  this.loadStatuses();
  this.loadSuggestions();
}

loadSuggestions(): void {
  this.loadingSuggestions = true;
  // Últimos 30 días automático
  const today  = new Date();
  const desde  = new Date(today);
  desde.setDate(desde.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().substring(0, 10);

  const url = `${ENDPOINTS.VEHICLE_DOWNTIME.SUGGESTIONS}?fecha_desde=${fmt(desde)}&fecha_hasta=${fmt(today)}`;
  this.api.getAuth(url).subscribe({
    next: (res: any) => {
      this.suggestions = res.suggestions.map((s: any) => ({
        ...s,
        selectedStatusId: s.maintenance_id
          ? this.statuses.find((st: any) => st.name.toLowerCase().includes('taller'))?.id || null
          : null,
        observations: '',
        saving: false,
      }));
      this.loadingSuggestions = false;
      this.cdr.detectChanges();
    },
    error: () => { this.loadingSuggestions = false; }
  });
}

  loadStatuses(): void {
    this.api.getAuth(ENDPOINTS.VEHICLE_DOWNTIME.STATUSES).subscribe((d: any) => {
      this.statuses = Array.isArray(d) ? d : [];
      this.cdr.detectChanges();
    });
  }

  // ─── SUGERENCIAS ──────────────────────────────────────────────────────────
  consultSuggestions(): void {
    if (!this.fechaDesde || !this.fechaHasta) {
      this.toast.error('Seleccioná el rango de fechas');
      return;
    }
    this.loadingSuggestions = true;
    const url = `${ENDPOINTS.VEHICLE_DOWNTIME.SUGGESTIONS}?fecha_desde=${this.fechaDesde}&fecha_hasta=${this.fechaHasta}`;
    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.suggestions = res.suggestions.map((s: any) => ({
          ...s,
          // Pre-llenar estado si es taller
          selectedStatusId:  s.maintenance_id
            ? this.statuses.find(st => st.name.toLowerCase().includes('taller'))?.id || null
            : null,
          observations: '',
          saving: false,
        }));
        this.loadingSuggestions = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loadingSuggestions = false; }
    });
  }

  saveSuggestion(s: any): void {
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
        // Quitar de sugerencias
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
    // if (this.fechaDesde) url += `&fecha_desde=${this.fechaDesde}`;
    // if (this.fechaHasta) url += `&fecha_hasta=${this.fechaHasta}`;

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
          // raw para editar
          _raw:     r,
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  onAction(event: { action: string; row: any }): void {
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

  // ─── CREAR MANUAL ─────────────────────────────────────────────────────────
  openCreateModal(): void {
    const ref = this.dialog.open(VehicleDowntimeFormModal, {
      data: { record: null, statuses: this.statuses },
      panelClass: 'dialog-panel',
      width: '520px',
    });
    ref.afterClosed().subscribe(r => {
      if (r?.saved) {
        this.loadRecords(this.lastParams);
        // Refrescar sugerencias si están cargadas
        if (this.suggestions.length) this.consultSuggestions();
      }
    });
  }

  setTab(tab: 'suggestions' | 'records'): void {
    this.activeTab = tab;
    if (tab === 'records' && this.records.length === 0) {
      this.loadRecords(this.lastParams);
    }
  }

  getStatusName(id: number): string {
    return this.statuses.find(s => s.id === id)?.name || '';
  }
}