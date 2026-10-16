import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

import {
  DataTableComponent,
  TableColumn,
  TablePage
} from '../../../../../core/components/data-table/data-table';

import { FilterPanelComponent } from '../../../../../core/components/filter-panel/filter-panel';
import {
  LocalTable,
  toYMD,
  fmtDMY,
  inDateRange,
  textIncludes
} from '../../../../../core/utils/local-table';

import { TransportCompanieFormModal } from '../../modals/transport-companie-form-modal/transport-companie-form-modal';

interface Row {
  id: number;
  fecha: string;
  fechaOrden: string;  // Formato interno: yyyy-MM-dd
  nit: string;
  nombre: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-transport-companies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './transport-companies.html',
  styleUrl: './transport-companies.scss',
})
export class TransportCompaniesComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  private raw: any[] = [];

  table = new LocalTable<Row>({
    searchKeys: ['fecha', 'nit', 'nombre', 'estado'],

    labels: {
      fecha: fmtDMY,
      estado: v => v === 'activo' ? 'Activo' : 'Inactivo'
    },

    defaultSort: {
      key: 'fechaOrden',
      dir: 'desc'
    },

    tieKey: 'id'
  });

  columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha de creación', sortable: true },
    { key: 'nit', label: 'NIT', sortable: true },
    { key: 'nombre', label: 'Nombre', sortable: true },
    {
      key: 'estado',
      label: 'Estado',
      format: 'badge',
      sortable: true,
      badgeMap: {
        activo: {
          label: 'Activo',
          class: 'badge-active'
        },
        inactivo: {
          label: 'Inactivo',
          class: 'badge-inactive'
        },
      },
    },
  ];

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true },
  ];

  // Panel de filtros
  filterOpen = false;
  activeFilterCount = 0;
  filters = this.emptyFilters();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.api.getAuth(ENDPOINTS.TRANSPORT_COMPANIES.LIST).subscribe({
      next: (data: any) => {
        this.raw = Array.isArray(data)
          ? data
          : data?.data ?? [];

        this.table.setData(
          this.raw.map(c => ({
            id: c.id,
            fecha: fmtDMY(
              c.create_at ?? c.created_at ?? c.createdAt
            ),
            fechaOrden: toYMD(
              c.create_at ?? c.created_at ?? c.createdAt
            ),
            nit: String(c.nit ?? ''),
            nombre: String(c.name ?? '').trim(),
            estado: c.active ? 'activo' : 'inactivo',
          }))
        );

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toast.error('No se pudieron cargar las empresas de transporte');
        this.cdr.detectChanges();
      },
    });
  }

  // Paginación y ordenamiento
  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  // Filtros
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

    this.table.setFilter(
      this.activeFilterCount
        ? (r => {
          if (!textIncludes(r.nit, f.nit)) return false;
          if (!textIncludes(r.nombre, f.nombre)) return false;

          if (f.estado && r.estado !== f.estado) {
            return false;
          }

          if (!inDateRange(r.fechaOrden, f.fechaDesde, f.fechaHasta)) {
            return false;
          }

          return true;
        })
        : null
    );

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

  // Acciones
  onAction(event: { action: string; row: Row }): void {
    const item = this.raw.find(c => c.id === event.row.id);

    if (!item) return;

    if (event.action === 'edit') {
      this.edit(item);
    }

    if (event.action === 'delete') {
      this.confirmDelete(item);
    }
  }

  openModal(): void {
    const ref = this.dialog.open(TransportCompanieFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '560px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  edit(item: any): void {
    const ref = this.dialog.open(TransportCompanieFormModal, {
      data: item,
      panelClass: 'dialog-panel',
      width: '560px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;

    this.api.deleteAuth(
      ENDPOINTS.TRANSPORT_COMPANIES.DELETE(item.id)
    ).subscribe({
      next: () => {
        this.toast.success('Empresa eliminada');
        this.load();
      },
      error: () => {
        this.toast.error('Error al eliminar la empresa');
      },
    });
  }

  // Formato de fecha para la tabla
  private formatDate(
    value: string | Date | null | undefined
  ): string {
    if (!value) return '';

    const date = new Date(value);

    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  // Conversión de dd/MM/yyyy a fecha local
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
}