
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

import { TransportAssistantFormModal } from '../../modals/transport-assistant-form-modal/transport-assistant-form-modal';

interface TransportAssistantRow extends Record<string, any> {
  id: number;
  fecha: string;
  fechaOrden: string;
  documento: string;
  nombre: string;
  telefono: string;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-transport-assistants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './transport-assistants.html',
  styleUrl: './transport-assistants.scss',
})
export class TransportAssistantsComponent implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  filterOpen = false;

  private raw: any[] = [];

  table = new LocalTable<TransportAssistantRow>({
    searchKeys: [
      'fecha',
      'documento',
      'nombre',
      'telefono',
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
      key: 'documento',
      label: 'Documento',
      sortable: true
    },
    {
      key: 'nombre',
      label: 'Nombre',
      sortable: true
    },
    {
      key: 'telefono',
      label: 'Teléfono',
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

  activeFilterCount = 0;

  filters = this.emptyFilters();

  ngOnInit(): void {
    this.load();
  }

  private emptyFilters() {
    return {
      documento: '',
      nombre: '',
      telefono: '',
      fechaDesde: '',
      fechaHasta: '',
      estado: ''
    };
  }

  load(): void {
    this.loading = true;

    this.api.getAuth(
      ENDPOINTS.TRANSPORT_ASSISTANTS.LIST
    ).subscribe({

      next: (res: any) => {

        this.raw = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : [];

        this.table.setData(
          this.raw.map(a => {

            const fechaCreacion =
              a.create_at ??
              a.created_at ??
              a.createdAt;

            return {
              id: Number(a.id),

              fecha: fmtDMY(fechaCreacion),
              fechaOrden: toYMD(fechaCreacion),

              documento: String(
                a.document_number ?? ''
              ).trim(),

              nombre: String(
                a.name ?? ''
              ).trim(),

              telefono: String(
                a.phone ?? ''
              ).trim(),

              estado: a.active
                ? 'activo'
                : 'inactivo'

            } as TransportAssistantRow;
          })
        );

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {

        console.error(
          'Error al cargar auxiliares de transporte:',
          error
        );

        this.loading = false;

        this.toast.error(
          'No se pudieron cargar los auxiliares de transporte'
        );

        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {

    const f = this.filters;

    this.activeFilterCount = Object.values(f)
      .filter(v => v !== '')
      .length;

    this.table.setFilter(
      this.activeFilterCount
        ? (r => {

            if (!textIncludes(r.documento, f.documento)) {
              return false;
            }

            if (!textIncludes(r.nombre, f.nombre)) {
              return false;
            }

            if (!textIncludes(r.telefono, f.telefono)) {
              return false;
            }

            if (!inDateRange(
              r.fechaOrden,
              f.fechaDesde,
              f.fechaHasta
            )) {
              return false;
            }

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
      row: TransportAssistantRow;
    }
  ): void {

    const item = this.raw.find(
      a => Number(a.id) === event.row.id
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
      TransportAssistantFormModal,
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
      TransportAssistantFormModal,
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

    if (!confirm(
      `¿Eliminar auxiliar "${item.name}"?`
    )) {
      return;
    }

    this.api.deleteAuth(
      ENDPOINTS.TRANSPORT_ASSISTANTS.DELETE(item.id)
    ).subscribe({

      next: () => {

        this.toast.success(
          'Auxiliar eliminado'
        );

        this.load();
      },

      error: () => {

        this.toast.error(
          'Error al eliminar el auxiliar'
        );
      }
    });
  }
}
