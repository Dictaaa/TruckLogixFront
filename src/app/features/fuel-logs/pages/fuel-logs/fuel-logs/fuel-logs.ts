import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api/api.service';
import { HasRoleDirective } from '../../../../../core/directives/has-role';
import { AuthService } from '../../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent, TableColumn, TablePage } from '../../../../../core/components/data-table/data-table';
import { FuelLogFormModal } from '../../../modals/fuel-log-form-modal/fuel-log-form-modal/fuel-log-form-modal';

@Component({
  selector: 'app-fuel-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent],
  templateUrl: './fuel-logs.html',
  styleUrls: ['./fuel-logs.scss'],
})
export class FuelLogs implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading  = true;
  total    = 0;
  logs: any[] = [];
  private rawLogs: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: 'fecha', sortDir: 'desc'
  };

  columns: TableColumn[] = [
    { key: 'fecha',          label: 'Fecha',           format: 'date',     sortable: true  },
    { key: 'placa',          label: 'Placa',           format: 'placa'                     },
    { key: 'afiliado',       label: 'Afiliado',                            sortable: true  },
    { key: 'kmInicial',      label: 'Km Inicial',                          sortable: true  },
    { key: 'kmFinal',        label: 'Km Final',                            sortable: true  },
    { key: 'kmRecorrido',    label: 'Km Recorrido',                        sortable: true  },
    { key: 'galones',        label: 'Galones',                             sortable: true  },
    { key: 'precioPorGalon', label: 'Precio/Galón',    format: 'currency', sortable: true  },
    { key: 'totalValor',     label: 'Total',           format: 'currency', sortable: true  },
    { key: 'observaciones',  label: 'Observaciones'                                        },
  ];

  get actions() {
    const base: any[] = [];
    if (this.auth.hasRole([1, 2])) base.push({ label: 'Editar',   action: 'edit' });
    if (this.auth.hasRole([1]))    base.push({ label: 'Eliminar', action: 'delete', danger: true });
    return base;
  }

  ngOnInit(): void {}

  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.load(params);
  }

  load(params: TablePage): void {
    this.loading = true;

    let url = `${ENDPOINTS.FUEL_LOGS.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawLogs = res.data;
        this.total   = res.total;
        this.logs    = res.data.map((l: any) => this.mapLog(l));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private mapLog(l: any): any {
    return {
      id:            l.id,
      fecha:         l.fuel_date,
      placa:         l.vehicle?.plate          || '',
      afiliado:      l.affiliate?.name         || '',
      kmInicial:     Number(l.km_initial       || 0),
      kmFinal:       Number(l.km_final         || 0),
      kmRecorrido:   Number(l.km_driven        || 0),
      galones:       Number(l.gallons          || 0),
      precioPorGalon:Number(l.price_per_gallon || 0),
      totalValor:    Number(l.total_value      || 0),
      observaciones: l.observations            || '',
    };
  }

  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(row: any): void {
    const raw = this.rawLogs.find(l => String(l.id) === String(row.id));
    if (!raw) return;

    const ref = this.dialog.open(FuelLogFormModal, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '700px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar el registro #${row.id}?`)) return;
    this.api.deleteAuth(ENDPOINTS.FUEL_LOGS.DELETE(row.id)).subscribe({
      next: () => {
        this.toast.success('Registro eliminado');
        setTimeout(() => this.load(this.lastParams));
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(FuelLogFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '700px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }
}