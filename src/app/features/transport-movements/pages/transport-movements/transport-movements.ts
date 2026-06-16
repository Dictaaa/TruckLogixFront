import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { TransportMovementFormModalComponent } from '../../modals/transport-movement-form-modal/transport-movement-form-modal';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';

@Component({
  selector: 'app-transport-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent],
  templateUrl: './transport-movements.html',
  styleUrls: ['./transport-movements.scss'],
})
export class TransportMovementsComponent implements OnInit {

  private apiService = inject(ApiService);
  private dialog     = inject(MatDialog);
  private auth       = inject(AuthService);
  private cdr        = inject(ChangeDetectorRef);
  private toast      = inject(ToastService);

  loading   = true;
  total     = 0;
  movements: any[] = [];

  private rawTrips: any[] = [];

  // Última params para reload tras guardar/eliminar
  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: '', sortDir: 'asc'
  };

  columns: TableColumn[] = [
    { key: 'fecha',              label: 'Fecha',              format: 'date',     sortable: true },
    { key: 'empresaTransporte',  label: 'Empresa Transporte',                     sortable: true },
    { key: 'placa',              label: 'Placa',              format: 'placa'                    },
    { key: 'contenedor',         label: 'Contenedor'                                             },
    { key: 'cliente',            label: 'Cliente',                                sortable: true },
    { key: 'linea',              label: 'Línea'                                                  },
    { key: 'origen',             label: 'Origen'                                                 },
    { key: 'destino',            label: 'Destino'                                                },
    { key: 'operacion',          label: 'Operación'                                              },
    { key: 'conductor',          label: 'Conductor'                                              },
    { key: 'estado',             label: 'Estado'                                                 },
    { key: 'flete',              label: 'Flete',              format: 'currency', sortable: true },
    { key: 'afiliado',           label: 'Afiliado'                                               },
    { key: 'auxiliarTransporte', label: 'Auxiliar Transporte'                                    },
    { key: 'transporteComida',   label: 'T. y Comida',        format: 'currency'                 },
    { key: 'observacion',        label: 'Observación'                                            },
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
    this.loadTrips(params);
  }

  loadTrips(params: TablePage): void {
    this.loading = true;

    let url = `${ENDPOINTS.TRIPS.LIST}?page=${params.page}&limit=${params.limit}`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;
    if (params.column) url += `&column=${params.column}`;
    if (params.sortBy) url += `&sortBy=${params.sortBy}&sortDir=${params.sortDir}`;

    this.apiService.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawTrips  = res.data;
        this.total     = res.total;
        this.movements = res.data.map((trip: any) => this.mapTrip(trip));
        this.loading   = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  private statusMap: Record<string, string> = {
  '1': 'Lleno',
  '2': 'Vacío',
  '3': 'Carga suelta',
};

  private mapTrip(trip: any): any {
    return {
      id:                trip.id,
      fecha:             trip.trip_date,
      empresaTransporte: trip.transportCompany?.name  || '',
      placa:             trip.vehicle?.plate          || '',
      contenedor:        trip.container?.number       || '',
      cliente:           trip.client?.name            || '',
      linea:             trip.shippingLine?.name      || '',
      origen:            trip.origin?.name            || '',
      destino:           trip.destination?.name       || '',
      operacion:         trip.operation?.name         || '',
      conductor:         trip.driver?.name            || '',
      estado:            this.statusMap[trip.client_status] || trip.client_status || '',
      flete:             Number(trip.freight_value    || 0),
      comisionPagada:    Number(trip.commission_paid  || 0),
      afiliado:          trip.affiliate?.name         || '',
      auxiliarTransporte:trip.transportAssistant?.name|| '',
      transporteComida:  Number(trip.transport_food_value || 0),
      observacion:       trip.observations            || '',
    };
  }

  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(mov: any): void {
    const raw = this.rawTrips.find(t => String(t.id) === String(mov.id));
    if (!raw) return;

    const ref = this.dialog.open(TransportMovementFormModalComponent, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '860px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.loadTrips(this.lastParams));
    });
  }

  confirmDelete(mov: any): void {
    if (!confirm(`¿Eliminar el movimiento #${mov.id}?`)) return;
    this.apiService.deleteAuth(ENDPOINTS.TRIPS.DELETE(mov.id)).subscribe({
      next: () => {
        this.toast.success('Movimiento eliminado');
        setTimeout(() => this.loadTrips(this.lastParams));
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(TransportMovementFormModalComponent, {
      data: null,
      panelClass: 'dialog-panel',
      width: '860px',
      maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.loadTrips(this.lastParams));
    });
  }
}