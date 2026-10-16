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

import { ContainerFormModal } from '../../modals/container-form-modal/container-form-modal';

interface ContainerRow extends Record<string, any> {
  id: number;

  // Fecha visible e interna
  fecha: string;
  fechaOrden: string;

  numero: string;
  tamano: string;
  tamanoId: string;

  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-containers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './containers.html',
  styleUrl: './containers.scss',
})
export class ContainersComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;

  private raw: any[] = [];

  containerSizes: Record<number, string> = {
    1: "20'",
    2: "40'",
    3: "45'"
  };

  table = new LocalTable<ContainerRow>({
    searchKeys: [
      'fecha',
      'numero',
      'tamano',
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
      key: 'numero',
      label: 'Número',
      sortable: true
    },
    {
      key: 'tamano',
      label: 'Tamaño',
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

    this.api.getAuth(ENDPOINTS.CONTAINERS.LIST).subscribe({
      next: (data: any) => {

        this.raw = Array.isArray(data)
          ? data
          : data?.data ?? [];

        this.table.setData(
          this.raw.map(c => {

            const fechaCreacion =
              c.create_at ??
              c.created_at ??
              c.createdAt;

            const tamanoId = String(
              c.container_size_id ?? ''
            );

            return {
              id: Number(c.id),

              fecha: fmtDMY(fechaCreacion),
              fechaOrden: toYMD(fechaCreacion),

              numero: String(c.number ?? '').trim(),

              tamano: tamanoId
                ? this.containerSizes[Number(tamanoId)] ?? tamanoId
                : '',

              tamanoId,

              estado: c.active
                ? 'activo'
                : 'inactivo'
            } as ContainerRow;
          })
        );

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: () => {
        this.loading = false;
        this.toast.error(
          'No se pudieron cargar los contenedores'
        );
        this.cdr.detectChanges();
      }
    });
  }

  private emptyFilters() {
    return {
      numero: '',
      tamano: '',
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

            // Número
            if (!textIncludes(r.numero, f.numero)) {
              return false;
            }

            // Tamaño
            if (
              f.tamano &&
              r.tamanoId !== f.tamano
            ) {
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
      row: ContainerRow;
    }
  ): void {

    const item = this.raw.find(
      c => Number(c.id) === event.row.id
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
      ContainerFormModal,
      {
        data: null,
        panelClass: 'dialog-panel',
        width: '560px',
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
      ContainerFormModal,
      {
        data: item,
        panelClass: 'dialog-panel',
        width: '560px',
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
        `¿Eliminar contenedor "${item.number}"?`
      )
    ) {
      return;
    }

    this.api.deleteAuth(
      ENDPOINTS.CONTAINERS.DELETE(item.id)
    ).subscribe({

      next: () => {
        this.toast.success(
          'Contenedor eliminado'
        );

        this.load();
      },

      error: () => {
        this.toast.error(
          'Error al eliminar el contenedor'
        );
      }
    });
  }
}