
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

import { DriverFormModal } from '../../modals/driver-form-modal/driver-form-modal';

interface DriverRow extends Record<string, any> {
  id: number;

  // Fecha de creación visible e interna para ordenar
  fecha: string;
  fechaOrden: string;

  nombre: string;
  documento: string;
  telefono: string;
  categoria: string;
  categoriaId: string;
  licencia: string;

  // Vencimiento visible e interno para filtrar
  vencimiento: string;
  vencimientoOrden: string;

  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class DriversComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  private raw: any[] = [];

  licenseCategories: Record<number, string> = {
    1: 'A1',
    2: 'A2',
    3: 'B1',
    4: 'B2',
    5: 'B3',
    6: 'C1',
    7: 'C2',
    8: 'C3'
  };

  table = new LocalTable<DriverRow>({
    searchKeys: [
      'fecha',
      'nombre',
      'documento',
      'telefono',
      'categoria',
      'licencia',
      'vencimiento',
      'estado'
    ],
    labels: {
      estado: v => v === 'activo' ? 'Activo' : 'Inactivo'
    },
    defaultSort: {
      key: 'fechaOrden',
      dir: 'desc'
    },
    tieKey: 'id'
  });

  columns: TableColumn[] = [
    {
      key: 'fecha',
      label: 'Fecha de creación',
      sortable: false
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'documento',
      label: 'Documento',
      sortable: true
    },
    {
      key: 'telefono',
      label: 'Teléfono',
      sortable: true
    },
    {
      key: 'categoria',
      label: 'Categoría',
      sortable: true
    },
    {
      key: 'licencia',
      label: 'N.º Licencia',
      sortable: true
    },
    {
      key: 'vencimiento',
      label: 'Vencimiento',
      sortable: false
    },
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
        }
      }
    }
  ];

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  filterOpen = false;
  activeFilterCount = 0;

  filters = this.emptyFilters();

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.api.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe({
      next: (data: any) => {
        this.raw = Array.isArray(data)
          ? data
          : data?.data ?? [];

        this.table.setData(
          this.raw.map(d => {
            const fechaCreacion =
              d.create_at ?? d.created_at ?? d.createdAt;

            const fechaVencimiento = d.license_expiration;

            const categoriaId = String(
              d.license_category_id ?? ''
            );

            return {
              id: Number(d.id),

              fecha: fmtDMY(fechaCreacion),
              fechaOrden: toYMD(fechaCreacion),

              nombre: String(d.name ?? '').trim(),
              documento: String(d.document ?? ''),
              telefono: String(d.phone ?? ''),

              categoria: categoriaId
                ? this.licenseCategories[Number(categoriaId)] ?? categoriaId
                : '',

              categoriaId,
              licencia: String(d.license_number ?? ''),

              vencimiento: fmtDMY(fechaVencimiento),
              vencimientoOrden: toYMD(fechaVencimiento),

              estado: d.active ? 'activo' : 'inactivo'
            } as DriverRow;
          })
        );

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toast.error('No se pudieron cargar los conductores');
        this.cdr.detectChanges();
      }
    });
  }

  private emptyFilters() {
    return {
      nombre: '',
      documento: '',
      telefono: '',
      categoria: '',
      licencia: '',
      fechaDesde: '',
      fechaHasta: '',
      vencimientoDesde: '',
      vencimientoHasta: '',
      estado: ''
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
            if (!textIncludes(r.nombre, f.nombre)) {
              return false;
            }

            if (!textIncludes(r.documento, f.documento)) {
              return false;
            }

            if (!textIncludes(r.telefono, f.telefono)) {
              return false;
            }

            if (
              f.categoria &&
              r.categoriaId !== f.categoria
            ) {
              return false;
            }

            if (!textIncludes(r.licencia, f.licencia)) {
              return false;
            }

            if (
              !inDateRange(
                r.fechaOrden,
                f.fechaDesde,
                f.fechaHasta
              )
            ) {
              return false;
            }

            if (
              !inDateRange(
                r.vencimientoOrden,
                f.vencimientoDesde,
                f.vencimientoHasta
              )
            ) {
              return false;
            }

            if (f.estado && r.estado !== f.estado) {
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

  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  onAction(event: { action: string; row: DriverRow }): void {
    const item = this.raw.find(d => Number(d.id) === event.row.id);

    if (!item) return;

    if (event.action === 'edit') {
      this.edit(item);
    }

    if (event.action === 'delete') {
      this.confirmDelete(item);
    }
  }

  openModal(): void {
    const ref = this.dialog.open(DriverFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '640px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  edit(item: any): void {
    const ref = this.dialog.open(DriverFormModal, {
      data: item,
      panelClass: 'dialog-panel',
      width: '640px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  isExpiringSoon(date: string): boolean {
    if (!date) return false;

    const expiration = toYMD(date);
    const today = toYMD(new Date());

    if (!expiration || !today || expiration < today) {
      return false;
    }

    const expirationMs = new Date(
      `${expiration}T00:00:00`
    ).getTime();

    const todayMs = new Date(
      `${today}T00:00:00`
    ).getTime();

    const days = (expirationMs - todayMs) / 86400000;

    return days <= 30;
  }

  isExpired(date: string): boolean {
    if (!date) return false;

    const expiration = toYMD(date);
    const today = toYMD(new Date());

    return !!expiration && !!today && expiration < today;
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;

    this.api.deleteAuth(
      ENDPOINTS.DRIVERS.DELETE(item.id)
    ).subscribe({
      next: () => {
        this.toast.success('Conductor eliminado');
        this.load();
      },
      error: () => {
        this.toast.error('Error al eliminar el conductor');
      }
    });
  }
}
