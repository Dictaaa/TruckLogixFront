
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

import { VehicleFormModal } from '../../modals/vehicle-form-modal/vehicle-form-modal';

type ExpiryStatus =
  | 'Vigente'
  | 'Por vencer'
  | 'Vencido'
  | 'Sin registrar';

interface VehicleRow extends Record<string, any> {
  id: number;
  fecha: string;
  fechaOrden: string;
  placa: string;
  soat: ExpiryStatus;
  soatFecha: string;
  soatOrden: string;
  rtm: ExpiryStatus;
  rtmFecha: string;
  rtmOrden: string;
  estado: 'activo' | 'inactivo';
  raw: any;
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
})
export class VehiclesComponent implements OnInit {
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
      key: 'placa',
      label: 'Placa',
      sortable: true
    },
    {
      key: 'soat',
      label: 'Estado SOAT',
      sortable: true,
      format: 'badge',
      badgeMap: {
        'Vigente': {
          label: 'Vigente',
          class: 'badge-active'
        },
        'Por vencer': {
          label: 'Por vencer',
          class: 'badge-warning'
        },
        'Vencido': {
          label: 'Vencido',
          class: 'badge-inactive'
        },
        'Sin registrar': {
          label: 'Sin registrar',
          class: 'badge-inactive'
        }
      }
    },
    {
      key: 'soatFecha',
      label: 'Vencimiento SOAT',
      sortable: true
    },
    {
      key: 'rtm',
      label: 'Estado RTM',
      sortable: true,
      format: 'badge',
      badgeMap: {
        'Vigente': {
          label: 'Vigente',
          class: 'badge-active'
        },
        'Por vencer': {
          label: 'Por vencer',
          class: 'badge-warning'
        },
        'Vencido': {
          label: 'Vencido',
          class: 'badge-inactive'
        },
        'Sin registrar': {
          label: 'Sin registrar',
          class: 'badge-inactive'
        }
      }
    },
    {
      key: 'rtmFecha',
      label: 'Vencimiento RTM',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado del vehículo',
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

  table = new LocalTable<VehicleRow>({
    searchKeys: [
      'fecha',
      'placa',
      'soat',
      'soatFecha',
      'rtm',
      'rtmFecha',
      'estado'
    ],
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

  private emptyFilters() {
    return {
      placa: '',
      fechaDesde: '',
      fechaHasta: '',
      soatDesde: '',
      soatHasta: '',
      rtmDesde: '',
      rtmHasta: '',
      estado: ''
    };
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe({
      next: (response: any) => {
        // Admite respuestas como [] o { data: [] }.
        // También contempla envolturas adicionales del backend.
        let data = response;

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
            'Respuesta inesperada al cargar vehículos:',
            response
          );
          data = [];
        }

        this.raw = data;

        const rows: VehicleRow[] = this.raw.map((v: any) => {
          const fechaCreacion =
            v.create_at ??
            v.created_at ??
            v.createdAt;

          const soatOriginal = v.soat_expiration;
          const rtmOriginal = v.rtm_expiration;

          const soatOrden = toYMD(soatOriginal);
          const rtmOrden = toYMD(rtmOriginal);

          return {
            id: Number(v.id),

            fecha: fmtDMY(fechaCreacion),
            fechaOrden: toYMD(fechaCreacion),

            placa: String(v.plate ?? '').trim(),

            soat: this.getExpiryStatus(soatOrden),
            soatFecha: soatOrden ? fmtDMY(soatOriginal) : '—',
            soatOrden,

            rtm: this.getExpiryStatus(rtmOrden),
            rtmFecha: rtmOrden ? fmtDMY(rtmOriginal) : '—',
            rtmOrden,

            estado: this.isActive(v.active)
              ? 'activo'
              : 'inactivo',

            raw: v
          };
        });

        this.table.setData(rows);
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Error al cargar vehículos:', error);

        this.loading = false;
        this.toast.error('No se pudieron cargar los vehículos');
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

  private getExpiryStatus(date: string): ExpiryStatus {
    if (!date) return 'Sin registrar';

    const expiration = this.parseLocalDate(date);

    if (!expiration) return 'Sin registrar';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (expiration.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) return 'Vencido';
    if (diffDays <= 30) return 'Por vencer';

    return 'Vigente';
  }

  private parseLocalDate(value: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    // Evita aceptar fechas inválidas, como 2026-02-31.
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);

    return date;
  }

  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  onAction(event: { action: string; row: VehicleRow }): void {
    const item = this.raw.find(
      v => Number(v.id) === event.row.id
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
    const ref = this.dialog.open(VehicleFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '560px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  edit(item: any): void {
    const ref = this.dialog.open(VehicleFormModal, {
      data: item,
      panelClass: 'dialog-panel',
      width: '560px',
      maxHeight: '90vh'
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load();
    });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar vehículo "${item.plate}"?`)) {
      return;
    }

    this.api.deleteAuth(
      ENDPOINTS.VEHICLES.DELETE(item.id)
    ).subscribe({
      next: () => {
        this.toast.success('Vehículo eliminado');
        this.load();
      },
      error: (error: any) => {
        console.error('Error al eliminar vehículo:', error);
        this.toast.error('Error al eliminar el vehículo');
      }
    });
  }

  applyFilters(): void {
    const f = this.filters;

    this.table.setFilter((r: VehicleRow) => {
      if (!textIncludes(r.placa, f.placa)) return false;

      if (!inDateRange(
        r.fechaOrden,
        f.fechaDesde,
        f.fechaHasta
      )) return false;

      if (!inDateRange(
        r.soatOrden,
        f.soatDesde,
        f.soatHasta
      )) return false;

      if (!inDateRange(
        r.rtmOrden,
        f.rtmDesde,
        f.rtmHasta
      )) return false;

      if (f.estado && r.estado !== f.estado) {
        return false;
      }

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
