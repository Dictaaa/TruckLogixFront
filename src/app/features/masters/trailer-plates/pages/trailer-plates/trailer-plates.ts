
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
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
  toYMD,
  fmtDMY,
  inDateRange,
  textIncludes
} from '../../../../../core/utils/local-table';


import { TrailerPlateFormModal } from '../../modals/trailer-plate-form-modal/trailer-plate-form-modal';

@Component({
  selector: 'app-trailer-plates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './trailer-plates.html',
  styleUrls: ['./trailer-plates.scss'],
})
export class TrailerPlates implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  loading = true;
  total = 0;
  records: any[] = [];
  private rawRecords: any[] = [];

  filterOpen = false;

  filters = {
    plate: '',
    vehiclePlate: '',
    fechaDesde: '',
    fechaHasta: ''
  };

  private lastParams: TablePage = {
    page: 1,
    limit: 10,
    search: '',
    column: '',
    sortBy: '',
    sortDir: 'asc'
  };

  columns: TableColumn[] = [
    {
      key: 'fecha',
      label: 'Fecha de creación',
      sortable: false
    },
    {
      key: 'plate',
      label: 'Placa Trailer',
      sortable: true
    },
    {
      key: 'vehiclePlate',
      label: 'Cabezote',
      sortable: true
    }
  ];

  get actions() {
    return [
      { label: 'Editar', action: 'edit' },
      { label: 'Eliminar', action: 'delete', danger: true },
    ];
  }

  ngOnInit(): void {
    this.load(this.lastParams);
  }

  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.load(params);
  }

  load(params: TablePage): void {
    this.loading = true;

    let url = `${ENDPOINTS.TRAILER_PLATES.LIST}?limit=200`;

    if (params.search) {
      url += `&search=${encodeURIComponent(params.search)}`;
    }

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        let data = res;

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
          console.error('Respuesta inesperada de placas trailer:', res);
          data = [];
        }

        this.rawRecords = data;

        this.records = data.map((r: any) => {
          const fechaCreacion =
            r.create_at ??
            r.created_at ??
            r.createdAt;

          return {
            id: Number(r.id),
            fecha: fmtDMY(fechaCreacion),
            fechaOrden: toYMD(fechaCreacion),
            plate: r.plate ?? '',
            vehiclePlate: r.vehicle?.plate || '—',
            vehicle_id: r.vehicle_id
          };
        });

        this.total = this.records.length;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error('Error al cargar placas trailer:', error);
        this.loading = false;
        this.toast.error('No se pudieron cargar las placas trailer');
        this.cdr.detectChanges();
      }
    });
  }

  get activeFilterCount(): number {
    return Object.values(this.filters)
      .filter(value => value !== '').length;
  }

  applyFilters(): void {
    const f = this.filters;

    this.records = this.rawRecords
      .map((r: any) => {
        const fechaCreacion =
          r.create_at ??
          r.created_at ??
          r.createdAt;

        return {
          id: Number(r.id),
          fecha: fmtDMY(fechaCreacion),
          fechaOrden: toYMD(fechaCreacion),
          plate: r.plate ?? '',
          vehiclePlate: r.vehicle?.plate || '—',
          vehicle_id: r.vehicle_id
        };
      })
      .filter((r: any) => {
        if (!textIncludes(r.plate, f.plate)) return false;

        if (!textIncludes(r.vehiclePlate, f.vehiclePlate)) {
          return false;
        }

        if (!inDateRange(
          r.fechaOrden,
          f.fechaDesde,
          f.fechaHasta
        )) {
          return false;
        }

        return true;
      });

    this.total = this.records.length;
    this.filterOpen = false;
    this.cdr.detectChanges();
  }

  clearFilters(): void {
    this.filters = {
      plate: '',
      vehiclePlate: '',
      fechaDesde: '',
      fechaHasta: ''
    };

    this.records = this.rawRecords.map((r: any) => {
      const fechaCreacion =
        r.create_at ??
        r.created_at ??
        r.createdAt;

      return {
        id: Number(r.id),
        fecha: fmtDMY(fechaCreacion),
        fechaOrden: toYMD(fechaCreacion),
        plate: r.plate ?? '',
        vehiclePlate: r.vehicle?.plate || '—',
        vehicle_id: r.vehicle_id
      };
    });

    this.total = this.records.length;
    this.filterOpen = false;
    this.cdr.detectChanges();
  }


  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') {
      this.edit(event.row);
    }

    if (event.action === 'delete') {
      this.confirmDelete(event.row);
    }
  }

  edit(row: any): void {
    const raw = this.rawRecords.find(
      r => Number(r.id) === Number(row.id)
    );

    if (!raw) return;

    const ref = this.dialog.open(TrailerPlateFormModal, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '480px',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load(this.lastParams);
    });
  }

  openModal(): void {
    const ref = this.dialog.open(TrailerPlateFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '480px',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) this.load(this.lastParams);
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar trailer "${row.plate}"?`)) return;

    this.api.deleteAuth(
      ENDPOINTS.TRAILER_PLATES.DELETE(row.id)
    ).subscribe({
      next: () => {
        this.toast.success('Placa trailer eliminada');
        this.load(this.lastParams);
      },
      error: (error: any) => {
        console.error('Error al eliminar placa trailer:', error);
        this.toast.error('Error al eliminar la placa trailer');
      }
    });
  }
}
