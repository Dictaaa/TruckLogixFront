import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../../core/services/toast/toast';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { DataTableComponent, TableColumn, TablePage } from '../../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../../core/components/filter-panel/filter-panel';
import { LocalTable } from '../../../../../core/utils/local-table';
import { ShippingLineFormModal } from '../../modals/shipping-line-form-modal/shipping-line-form-modal';

interface Row {
  id: number;
  fecha: string;
  nit: string;
  nombre: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-shipping-lines',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, FilterPanelComponent],
  templateUrl: './shipping-lines.html',
  styleUrl: './shipping-lines.scss',
})
export class ShippingLinesComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  private raw: any[] = [];

  /** Búsqueda, orden, filtros y paginación en el navegador */
  table = new LocalTable<Row>({
    searchKeys: ['fecha', 'nit', 'nombre', 'estado'],
    labels: { estado: v => (v === 'activo' ? 'Activo' : 'Inactivo') },
  });

  columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'nit', label: 'NIT', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    {
      key: 'estado', label: 'Estado', format: 'badge', sortable: true,
      badgeMap: {
        activo: { label: 'Activo', class: 'badge-active' },
        inactivo: { label: 'Inactivo', class: 'badge-inactive' },
      },
    },
  ];

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true },
  ];

  // ── Panel de filtros ──────────────────────────────────────────────────
  filterOpen = false;
  activeFilterCount = 0;
  filters = this.emptyFilters();

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.SHIPPING_LINES.LIST).subscribe({
      next: (data: any) => {
        this.raw = Array.isArray(data) ? data : data?.data ?? [];
        this.table.setData(this.raw.map(s => ({
          id: s.id,
          fecha: this.formatDate(s.created_at ?? new Date()),
          nit: s.nit ?? '',
          nombre: (s.name ?? '').trim(),
          estado: s.active ? 'activo' : 'inactivo',
        })));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toast.error('No se pudieron cargar las líneas navieras');
        this.cdr.detectChanges();
      },
    });
  }

  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  // ── Filtros ───────────────────────────────────────────────────────────
  private emptyFilters() {
    return {
      nit: '',
      nombre: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
    };
  }

  applyFilters(): void {
    const f = this.filters;

    this.activeFilterCount = Object.values(f)
      .filter(v => v !== '')
      .length;

    this.table.setFilter(this.activeFilterCount ? (r => {
      // Filtro por NIT
      if (
        f.nit &&
        !r.nit.toLowerCase().includes(f.nit.trim().toLowerCase())
      ) {
        return false;
      }

      // Filtro por nombre
      if (
        f.nombre &&
        !r.nombre.toLowerCase().includes(f.nombre.trim().toLowerCase())
      ) {
        return false;
      }

      // Filtro por estado
      if (f.estado && r.estado !== f.estado) {
        return false;
      }

      // Filtro por fecha de creación
      const fecha = this.parseDate(r.fecha);

      if (f.fechaDesde) {
        const desde = new Date(`${f.fechaDesde}T00:00:00`);

        if (!fecha || fecha < desde) {
          return false;
        }
      }

      if (f.fechaHasta) {
        const hasta = new Date(`${f.fechaHasta}T23:59:59.999`);

        if (!fecha || fecha > hasta) {
          return false;
        }
      }

      return true;
    }) : null);

    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();
    this.activeFilterCount = 0;
    this.table.setFilter(null);
    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  /**
   * Convierte dd/MM/yyyy a una fecha local.
   */
  private parseDate(value: string): Date | null {
    if (!value) return null;

    const [day, month, year] = value.split('/').map(Number);

    if (!day || !month || !year) return null;

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  // ── Acciones ──────────────────────────────────────────────────────────
  onAction(event: { action: string; row: Row }): void {
    const item = this.raw.find(s => s.id === event.row.id);
    if (!item) return;
    if (event.action === 'edit') this.edit(item);
    if (event.action === 'delete') this.confirmDelete(item);
  }

  openModal(): void {
    const ref = this.dialog.open(ShippingLineFormModal, {
      data: null, panelClass: 'dialog-panel', width: '560px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(ShippingLineFormModal, {
      data: item, panelClass: 'dialog-panel', width: '560px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.SHIPPING_LINES.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Línea eliminada');
        this.load();
      },
      error: () => this.toast.error('Error al eliminar'),
    });
  }

  private formatDate(value: string | Date): string {
    const date = new Date(value);

    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}