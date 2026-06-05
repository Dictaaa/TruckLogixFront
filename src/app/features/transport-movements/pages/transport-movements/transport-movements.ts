import { Component, OnInit,ChangeDetectorRef, inject  } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api/api.service';
import { Movement } from '../../../../core/models/interfaces/trip.interface';
import { TransportMovementFormModalComponent } from '../../modals/transport-movement-form-modal/transport-movement-form-modal';
import { DialogService } from '../../../../core/services/dialog/dialog.service';

@Component({
  selector: 'app-transport-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './transport-movements.html',
  styleUrls: ['./transport-movements.scss'],
})
export class TransportMovementsComponent implements OnInit {

  private apiService = inject(ApiService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;

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

  constructor() {}

  ngOnInit(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.loading = true;
    this.apiService.getTrips().subscribe({
      next: (response: any) => {

        this.allMovements = response.map((trip: any) => ({
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

 openModal(): void {
  const ref = this.dialogService.open(TransportMovementFormModalComponent);

  ref.afterClosed().subscribe(result => {
    if (result?.saved) {
      this.loadTrips();
    }
  });
}
}