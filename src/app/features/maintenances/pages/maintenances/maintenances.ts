import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';
import { MaintenanceFormModalComponent } from '../../modals/maintenance-form-modal/maintenance-form-modal';

@Component({
  selector: 'app-maintenances',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent],
  templateUrl: './maintenances.html',
  styleUrls: ['./maintenances.scss'],
})
export class MaintenancesComponent implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading  = true;
  total    = 0;
  records: any[] = [];
  private rawRecords: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: 'fecha', sortDir: 'desc'
  };

  columns: TableColumn[] = [
    { key: 'fechaIngreso',    label: 'F. Ingreso',      format: 'date',     sortable: true  },
    { key: 'fechaSalida',     label: 'F. Salida',       format: 'date',     sortable: true  },
    { key: 'marca',           label: 'Marca',                               sortable: true  },
    { key: 'placa',           label: 'Placa',           format: 'placa'                     },
    { key: 'placaTrailer',    label: 'Placa Trailer'                                        },
    { key: 'afiliado',        label: 'Afiliado',                            sortable: true  },
    { key: 'tipoMtto',        label: 'Tipo MTTO',                           sortable: true  },
    { key: 'operacion',       label: 'Operación en Taller'                                  },
    { key: 'costoManoObra',   label: 'Mano de Obra',    format: 'currency', sortable: true  },
    { key: 'costoRepuesto',   label: 'Repuestos',       format: 'currency', sortable: true  },
    { key: 'totalCosto',      label: 'Total',           format: 'currency', sortable: true  },
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

    let url = `${ENDPOINTS.MAINTENANCES.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawRecords = res.data;
        this.total      = res.total;
        this.records    = res.data.map((r: any) => this.mapRecord(r));
        this.loading    = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private mapRecord(r: any): any {
    return {
      id:             r.id,
      fechaIngreso:   r.entry_date,
      fechaSalida:    r.exit_date    || '',
      marca:          r.brand?.name  || '',
      placa:          r.vehicle?.plate || '',
      placaTrailer:   r.trailer_plate  || '',
      afiliado:       r.affiliate?.name || '',
      tipoMtto:       r.maintenanceType?.name || '',
      operacion:      r.operation_detail || '',
      costoManoObra:  Number(r.labor_cost  || 0),
      costoRepuesto:  Number(r.parts_cost  || 0),
      totalCosto:     Number(r.total_cost  || 0),
    };
  }

  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(row: any): void {
    const raw = this.rawRecords.find(r => String(r.id) === String(row.id));
    if (!raw) return;

    const ref = this.dialog.open(MaintenanceFormModalComponent, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '860px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar el registro #${row.id}?`)) return;
    this.api.deleteAuth(ENDPOINTS.MAINTENANCES.DELETE(row.id)).subscribe({
      next: () => {
        this.toast.success('Registro eliminado');
        setTimeout(() => this.load(this.lastParams));
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(MaintenanceFormModalComponent, {
      data: null,
      panelClass: 'dialog-panel',
      width: '860px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.load(this.lastParams));
    });
  }
}