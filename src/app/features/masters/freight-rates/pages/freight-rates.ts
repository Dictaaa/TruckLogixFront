
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import {
  DataTableComponent,
  TableColumn,
  TablePage
} from '../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../core/components/filter-panel/filter-panel';
import { LocalTable } from '../../../../core/utils/local-table';
import { FreightRatesFormModal } from '../modals/freight-rates-form-modal/freight-rates-form-modal';

const CONDITIONS: Record<string, string> = {
  '1': 'Lleno',
  '2': 'Vacío',
  '3': 'Carga suelta'
};

const STATUS: Record<string, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo'
};

interface FreightRow {
  id: number;
  fecha: string;
  empresa: string;
  origen: string;
  destino: string;
  condicion: string;
  flete20: number | null;
  flete40: number | null;
  flete45: number | null;
  estado: 'activo' | 'inactivo';
}

@Component({
  selector: 'app-freight-rates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    FilterPanelComponent
  ],
  templateUrl: './freight-rates.html',
  styleUrl: './freight-rates.scss',
})
export class FreightRates implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);

  loading = true;
  private raw: any[] = [];

  /** Búsqueda, ordenamiento, filtros y paginación en el navegador */
  table = new LocalTable<FreightRow>({
    searchKeys: [
      'fecha',
      'empresa',
      'origen',
      'destino',
      'condicion',
      'flete20',
      'flete40',
      'flete45',
      'estado'
    ],
    labels: {
      condicion: v => CONDITIONS[String(v)] ?? '',
      estado: v => STATUS[String(v)] ?? ''
    }
  });

  columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', sortable: true },
    { key: 'empresa', label: 'Empresa transporte', sortable: true },
    { key: 'origen', label: 'Origen', sortable: true },
    { key: 'destino', label: 'Destino', sortable: true },
    {
      key: 'condicion',
      label: 'Condición',
      format: 'badge',
      sortable: true,
      badgeMap: {
        '1': { label: CONDITIONS['1'], class: 'badge-ok' },
        '2': { label: CONDITIONS['2'], class: 'badge-info' },
        '3': { label: CONDITIONS['3'], class: 'badge-warning' },
      },
    },
    {
      key: 'flete20',
      label: "Flete 20'",
      format: 'currency',
      sortable: true
    },
    {
      key: 'flete40',
      label: "Flete 40'",
      format: 'currency',
      sortable: true
    },
    {
      key: 'flete45',
      label: "Flete 45'",
      format: 'currency',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado',
      format: 'badge',
      sortable: true,
      badgeMap: {
        activo: {
          label: STATUS['activo'],
          class: 'badge-active'
        },
        inactivo: {
          label: STATUS['inactivo'],
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

  companyOptions: string[] = [];
  originOptions: string[] = [];
  destOptions: string[] = [];

  conditionOptions = Object.entries(CONDITIONS).map(
    ([value, label]) => ({ value, label })
  );

  ngOnInit(): void {
    this.load();
  }

  // Carga de tarifas
  load(): void {
    this.loading = true;

    this.api.getAuth(ENDPOINTS.FREIGHTS.LIST).subscribe({
      next: (data: any) => {
        this.raw = Array.isArray(data) ? data : data?.data ?? [];

        this.table.setData(this.raw.map(f => this.mapRow(f)));

        this.buildOptions();
        this.loading = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.toast.error('No se pudieron cargar las tarifas');
        this.cdr.detectChanges();
      },
    });
  }

  private mapRow(f: any): FreightRow {
    return {
      id: f.id,
      fecha: this.formatDate(f.created_at ?? new Date()),
      empresa: (f.transportCompany?.name ?? '').trim(),
      origen: (f.origin?.name ?? '').trim(),
      destino: (f.destination?.name ?? '').trim(),
      condicion: f.condition_id != null
        ? String(f.condition_id)
        : '',
      flete20: f.freight_20 != null ? Number(f.freight_20) : null,
      flete40: f.freight_40 != null ? Number(f.freight_40) : null,
      flete45: f.freight_45 != null ? Number(f.freight_45) : null,
      estado: f.active ? 'activo' : 'inactivo',
    };
  }

  private buildOptions(): void {
    const uniq = (key: keyof FreightRow): string[] =>
      [...new Set(
        this.raw
          .map(f => this.mapRow(f)[key])
          .filter((v): v is string =>
            typeof v === 'string' && v.length > 0
          )
      )].sort((a, b) => a.localeCompare(b, 'es'));

    this.companyOptions = uniq('empresa');
    this.originOptions = uniq('origen');
    this.destOptions = uniq('destino');
  }

  // Tabla: paginación y parámetros de búsqueda
  onPageChange(params: TablePage): void {
    this.table.setParams(params);
    this.cdr.detectChanges();
  }

  // Filtros del panel
  private emptyFilters() {
    return {
      empresa: '',
      origen: '',
      destino: '',
      condicion: '',
      estado: ''
    };
  }

  applyFilters(): void {
    const f = { ...this.filters };

    this.activeFilterCount = Object.values(f)
      .filter(v => v !== '').length;

    this.table.setFilter(this.activeFilterCount ? (r => {
      if (f.empresa && r.empresa !== f.empresa) return false;
      if (f.origen && r.origen !== f.origen) return false;
      if (f.destino && r.destino !== f.destino) return false;
      if (f.condicion && r.condicion !== f.condicion) return false;
      if (f.estado && r.estado !== f.estado) return false;

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

  // Acciones de la tabla
  onAction(event: { action: string; row: FreightRow }): void {
    const item = this.raw.find(f => f.id === event.row.id);

    if (!item) return;

    if (event.action === 'edit') {
      this.edit(item);
    }

    if (event.action === 'delete') {
      this.confirmDelete(item);
    }
  }

  openModal(): void {
    const ref = this.dialog.open(FreightRatesFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '700px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  edit(item: any): void {
    const ref = this.dialog.open(FreightRatesFormModal, {
      data: item,
      panelClass: 'dialog-panel',
      width: '700px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(r => {
      if (r?.saved) this.load();
    });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar la tarifa #${item.id}?`)) return;

    this.api.deleteAuth(ENDPOINTS.FREIGHTS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Tarifa eliminada');
        this.load();
      },
      error: () => this.toast.error('Error al eliminar la tarifa'),
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
