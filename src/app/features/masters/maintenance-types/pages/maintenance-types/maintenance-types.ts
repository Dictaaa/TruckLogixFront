
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

import { MaintenanceTypeFormModal } from '../../modals/maintenance-type-form-modal/maintenance-type-form-modal';

interface MaintenanceTypeRow extends Record<string, any> {
  id: number;
  fecha: string;
  fechaOrden: string;
  nombre: string;
  estado: 'activo' | 'inactivo';
  raw: any;
}

@Component({
  selector: 'app-maintenance-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './maintenance-types.html',
  styleUrl: './maintenance-types.scss',
})
export class MaintenanceTypes implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  filterOpen = false;

  private raw: any[] = [];

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

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
      key: 'estado',
      label: 'Estado',
      sortable: true,
      format: 'badge',
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

  table = new LocalTable<MaintenanceTypeRow>({
    searchKeys: ['fecha', 'nombre', 'estado'],
    labels: {
      estado: value =>
        value === 'activo' ? 'Activo' : 'Inactivo'
    },
    defaultSort: {
      key: 'fechaOrden',
      dir: 'desc'
    },
    tieKey: 'id'
  });

  filters = this.emptyFilters();

  private lastParams: TablePage = {
    page: 1,
    limit: 10,
    search: '',
    column: '',
    sortBy: '',
    sortDir: 'asc'
  };

  private emptyFilters() {
    return {
      nombre: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: ''
    };
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    // Mantiene el endpoint autenticado del módulo original.
    const url = `${ENDPOINTS.MAINTENANCE_TYPES.LIST}?page=1&limit=200`;

    this.api.getAuth(url).subscribe({
      next: (response: any) => {
        let data = response;

        // Admite [], { data: [] } y respuestas anidadas.
        for (let i = 0; i < 3; i++) {
          if (Array.isArray(data)) break;

          if (Array.isArray(data?.data)) {
            data = data.data;
            break;
          }

          if (data?.data && typeof data.data === 'object') {
            data = data.data;
            continue;
          }

          break;
        }

        if (!Array.isArray(data)) {
          console.error(
            'Respuesta inesperada al cargar tipos de mantenimiento:',
            response
          );
          data = [];
        }

        this.raw = data;

        const rows: MaintenanceTypeRow[] = this.raw.map((r: any) => {
          const fechaCreacion =
            r.create_at ??
            r.created_at ??
            r.createdAt;

          return {
            id: Number(r.id),
            fecha: fmtDMY(fechaCreacion),
            fechaOrden: toYMD(fechaCreacion),
            nombre: String(r.name ?? '').trim(),
            estado: this.isActive(r.active)
              ? 'activo'
              : 'inactivo',
            raw: r
          };
        });

        this.table.setData(rows);
        this.table.setParams(this.lastParams);

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error(
          'Error al cargar tipos de mantenimiento:',
          error
        );

        this.loading = false;
        this.toast.error(
          'No se pudieron cargar los tipos de mantenimiento'
        );
        this.cdr.detectChanges();
      }
    });
  }

  private isActive(value: any): boolean {
    return value === true ||
      value === 1 ||
      value === '1' ||
      (
        typeof value === 'string' &&
        value.toLowerCase() === 'true'
      );
  }

  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  onAction(event: {
    action: string;
    row: MaintenanceTypeRow;
  }): void {
    const item = this.raw.find(
      r => Number(r.id) === event.row.id
    );

    if (!item) return;

    if (event.action === 'edit') {
      this.edit(item);
    }

    if (event.action === 'delete') {
      this.confirmDelete(item);
    }
  }

  edit(row: any): void {
    const ref = this.dialog.open(MaintenanceTypeFormModal, {
      data: row,
      panelClass: 'dialog-panel',
      width: '420px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  openModal(): void {
    const ref = this.dialog.open(MaintenanceTypeFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '420px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar "${row.name}"?`)) return;

    this.api.deleteAuth(
      ENDPOINTS.MAINTENANCE_TYPES.DELETE(row.id)
    ).subscribe({
      next: () => {
        this.toast.success('Tipo de mantenimiento eliminado');
        this.load();
      },
      error: (error: any) => {
        console.error('Error al eliminar tipo de mantenimiento:', error);
        this.toast.error('Error al eliminar el tipo de mantenimiento');
      }
    });
  }

  applyFilters(): void {
    const f = this.filters;

    this.table.setFilter((r: MaintenanceTypeRow) => {
      if (!textIncludes(r.nombre, f.nombre)) return false;

      if (!inDateRange(
        r.fechaOrden,
        f.fechaDesde,
        f.fechaHasta
      )) return false;

      if (f.estado && r.estado !== f.estado) return false;

      return true;
    });

    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.filters = this.emptyFilters();

    this.table.setFilter(null);
    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  get activeFilterCount(): number {
    return Object.values(this.filters)
      .filter(value => value !== '').length;
  }
}
