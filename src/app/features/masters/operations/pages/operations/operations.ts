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

import { OperationFormModal } from '../../modals/operation-form-modal/operation-form-modal';

interface OperationRow extends Record<string, any> {
  id: number;

  fecha: string;
  fechaOrden: string;

  nombre: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './operations.html',
  styleUrl: './operations.scss',
})
export class OperationsComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;

  private raw: any[] = [];

  table = new LocalTable<OperationRow>({
    searchKeys: [
      'fecha',
      'nombre',
      'estado'
    ],

    labels: {
      estado: v =>
        v === 'activo' ? 'Activo' : 'Inactivo'
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

  // Filtros
  filterOpen = false;
  activeFilterCount = 0;

  filters = this.emptyFilters();

  ngOnInit(): void {
    this.load();
  }

  load(): void {

    this.loading = true;

    this.api.getAuth(ENDPOINTS.OPERATIONS.LIST).subscribe({

      next: (data: any) => {

        this.raw = Array.isArray(data)
          ? data
          : data?.data ?? [];

        this.table.setData(
          this.raw.map(o => {

            const fechaCreacion =
              o.create_at ??
              o.created_at ??
              o.createdAt;

            return {
              id: Number(o.id),

              fecha: fmtDMY(fechaCreacion),
              fechaOrden: toYMD(fechaCreacion),

              nombre: String(o.name ?? '').trim(),

              estado: o.active
                ? 'activo'
                : 'inactivo'
            } as OperationRow;
          })
        );

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {

        this.loading = false;

        this.toast.error(
          'No se pudieron cargar las operaciones'
        );

        this.cdr.detectChanges();
      }
    });
  }

  private emptyFilters() {
    return {
      nombre: '',
      fechaDesde: '',
      fechaHasta: '',
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

            // Nombre
            if (!textIncludes(r.nombre, f.nombre)) {
              return false;
            }

            // Fecha de creación
            if (
              !inDateRange(
                r.fechaOrden,
                f.fechaDesde,
                f.fechaHasta
              )
            ) {
              return false;
            }

            // Estado
            if (
              f.estado &&
              r.estado !== f.estado
            ) {
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

  onAction(
    event: {
      action: string;
      row: OperationRow;
    }
  ): void {

    const item = this.raw.find(
      o => Number(o.id) === event.row.id
    );

    if (!item) return;

    if (event.action === 'edit') {
      this.edit(item);
    }

    if (event.action === 'delete') {
      this.confirmDelete(item);
    }
  }

  openModal(): void {

    const ref = this.dialog.open(
      OperationFormModal,
      {
        data: null,
        panelClass: 'dialog-panel',
        width: '480px',
        maxHeight: '90vh'
      }
    );

    ref.afterClosed().subscribe(r => {

      if (r?.saved) {
        this.load();
      }

    });
  }

  edit(item: any): void {

    const ref = this.dialog.open(
      OperationFormModal,
      {
        data: item,
        panelClass: 'dialog-panel',
        width: '480px',
        maxHeight: '90vh'
      }
    );

    ref.afterClosed().subscribe(r => {

      if (r?.saved) {
        this.load();
      }

    });
  }

  confirmDelete(item: any): void {

    if (
      !confirm(
        `¿Eliminar operación "${item.name}"?`
      )
    ) {
      return;
    }

    this.api.deleteAuth(
      ENDPOINTS.OPERATIONS.DELETE(item.id)
    ).subscribe({

      next: () => {

        this.toast.success(
          'Operación eliminada'
        );

        this.load();
      },

      error: () => {

        this.toast.error(
          'Error al eliminar la operación'
        );
      }
    });
  }
}