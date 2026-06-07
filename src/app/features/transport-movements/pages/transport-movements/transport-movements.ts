import { Component, OnInit,ChangeDetectorRef, inject  } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { Movement } from '../../../../core/models/interfaces/trip.interface';
import { TransportMovementFormModalComponent } from '../../modals/transport-movement-form-modal/transport-movement-form-modal';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { TableActions } from '../../../../core/components/table-actions/table-actions';

@Component({
  selector: 'app-transport-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, HasRoleDirective, TableActions],
  templateUrl: './transport-movements.html',
  styleUrls: ['./transport-movements.scss'],
})
export class TransportMovementsComponent implements OnInit {

  private apiService = inject(ApiService);
  private dialogService = inject(DialogService);
  private dialog        = inject(MatDialog);
  private auth          = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toast         = inject(ToastService);

  loading = true;

   private rawTrips: any[] = [];

  allMovements: Movement[] = [];
  filteredMovements: Movement[] = [];

  filters = {
    search: '',
    linea: '',
    operacion: '',
    estadoTrabajo: ''
  };

  lineaOptions: string[] = [];
  operacionOptions: string[] = [];
  estadoTrabajoOptions: string[] = [];

  sortColumn: keyof Movement | '' = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  paginatedMovements: Movement[] = [];

  get actions() {
    const base: any[] = [];
    if (this.auth.hasRole([1, 2])) base.push({ label: 'Editar',   action: 'edit' });
    if (this.auth.hasRole([1]))    base.push({ label: 'Eliminar', action: 'delete', danger: true });
    return base;
  }

  constructor() {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.apiService.getTrips().subscribe({
      next: (response: any) => {
        const trips = response as any[];  // ← sin filtro frontend
      this.rawTrips = trips;
      this.allMovements = trips.map((trip: any) => ({
          id: trip.id,
          fecha: trip.trip_date,
          empresaTransporte: trip.transportCompany?.name || '',
          placa: trip.vehicle?.plate || '',
          contenedor: trip.container?.number || '',
          tamano: '',
          cliente: trip.client?.name || '',
          linea: trip.shippingLine?.name || '',
          origen: trip.origin?.name || '',
          destino: trip.destination?.name || '',
          operacion: trip.operation?.name || '',
          conductor: trip.driver?.name || '',
          estado: trip.client_status || '',
          flete: Number(trip.freight_value || 0),
          comisionPagada: Number(trip.commission_paid || 0),
          estadoTrabajo: trip.work_status || '',
          afiliado: trip.affiliate?.name || '',
          auxiliarTransporte: trip.transportAssistant?.name || '',
          transporteComida: Number(trip.transport_food_value || 0),
          observacion: trip.observations || '',
          fechaEnvioFacturar: trip.invoice_send_date || ''
        }));

        this.buildFilterOptions();
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  onAction(action: string, mov: Movement): void {
    if (action === 'edit')   this.edit(mov);
    if (action === 'delete') this.confirmDelete(mov);
  }

  edit(mov: Movement): void {
    // Busca el trip crudo para tener todos los ids
    const raw = this.rawTrips.find(t => String(t.id) === String(mov.id));
    if (!raw) return;

    const ref = this.dialog.open(TransportMovementFormModalComponent, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '860px',
      maxHeight: '90vh',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.loadTrips());
    });
  }

  confirmDelete(mov: Movement): void {
    if (!confirm(`¿Eliminar el movimiento #${mov.id}?`)) return;
    this.apiService.deleteAuth(ENDPOINTS.TRIPS.DELETE(mov.id)).subscribe({
      next: () => {
        this.toast.success('Movimiento eliminado');
        setTimeout(() => this.loadTrips());
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
      if (result?.saved) setTimeout(() => this.loadTrips());
    });
  }

  buildFilterOptions(): void {

  console.log('allMovements', this.allMovements);

  this.lineaOptions = [
    ...new Set(this.allMovements.map(x => x.linea))
  ].sort();

  console.log('lineaOptions', this.lineaOptions);
}

  applyFilters(): void {

    const term = this.filters.search.toLowerCase().trim();

    this.filteredMovements = this.allMovements.filter(m => {

      const searchMatch =
        !term ||
        [
          m.placa,
          m.contenedor,
          m.conductor,
          m.linea,
          m.afiliado,
          m.empresaTransporte
        ]
          .join(' ')
          .toLowerCase()
          .includes(term);

      const lineaMatch =
        !this.filters.linea ||
        m.linea === this.filters.linea;

      const operacionMatch =
        !this.filters.operacion ||
        m.operacion === this.filters.operacion;

      const estadoTrabajoMatch =
        !this.filters.estadoTrabajo ||
        m.estadoTrabajo === this.filters.estadoTrabajo;

      return (
        searchMatch &&
        lineaMatch &&
        operacionMatch &&
        estadoTrabajoMatch
      );
    });

    if (this.sortColumn) {
      this.sortData();
    }

    this.currentPage = 1;
    this.updatePagination();
  }

  clearFilters(): void {

    this.filters = {
      search: '',
      linea: '',
      operacion: '',
      estadoTrabajo: ''
    };

    this.sortColumn = '';
    this.sortDirection = 'asc';

    this.applyFilters();
  }

  sortBy(column: keyof Movement): void {

    if (this.sortColumn === column) {
      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortData();
    this.updatePagination();
  }

  private sortData(): void {

    const col = this.sortColumn as keyof Movement;

    this.filteredMovements.sort((a, b) => {

      const va = a[col];
      const vb = b[col];

      const cmp =
        typeof va === 'number'
          ? Number(va) - Number(vb)
          : String(va).localeCompare(String(vb));

      return this.sortDirection === 'asc'
        ? cmp
        : -cmp;
    });
  }

  getSortIcon(col: string): string {

    if (this.sortColumn !== col) {
      return '↕';
    }

    return this.sortDirection === 'asc'
      ? '↑'
      : '↓';
  }

  updatePagination(): void {

    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredMovements.length / this.pageSize)
    );

    const start =
      (this.currentPage - 1) * this.pageSize;

    this.paginatedMovements =
      this.filteredMovements.slice(
        start,
        start + this.pageSize
      );
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

}