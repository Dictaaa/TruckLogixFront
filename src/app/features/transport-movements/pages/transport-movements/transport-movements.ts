import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api/api.service';
import { TransportMovementFormModalComponent } from '../../modals/transport-movement-form-modal/transport-movement-form-modal';
import { HasRoleDirective } from '../../../../core/directives/has-role';
import { AuthService } from '../../../../core/services/auth.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { MatDialog } from '@angular/material/dialog';
import { DataTableComponent, TableColumn, TablePage } from '../../../../core/components/data-table/data-table';
import { FilterPanelComponent } from '../../../../core/components/filter-panel/filter-panel';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-transport-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective, DataTableComponent, FilterPanelComponent, MatAutocompleteModule],
  templateUrl: './transport-movements.html',
  styleUrls: ['./transport-movements.scss'],
})
export class TransportMovementsComponent implements OnInit {

  private apiService = inject(ApiService);
  private dialog = inject(MatDialog);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  loading = true;
  total = 0;
  movements: any[] = [];
  private rawTrips: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: '', sortDir: 'asc'
  };

  // ── Panel filtros ─────────────────────────────────────────────────────
  filterOpen = false;

  // Catálogos para los selects del panel
  lineaOptions: string[] = [];
  afiliadoOptions: string[] = [];
  estadoOptions = [
    { value: '1', label: 'Lleno' },
    { value: '2', label: 'Vacío' },
    { value: '3', label: 'Carga suelta' },
  ];

  filters = {
    fecha_desde: '',
    fecha_hasta: '',
    estado: '',
    afiliado: '',
    linea: '',
    conductor: '',
    placa: '',
    empresa_transporte: '',
    auxiliar: '',
    contenedor: '',
    origen: '',
    destino: '',
    cliente: '',
    operacion: '',
  };

  // Catálogos
  empresasAll: any[] = [];
  auxiliaresAll: any[] = [];
  clientesAll: any[] = [];
  operacionesAll: any[] = [];
  patiosAll: any[] = [];
  lineasAll: any[] = [];
  vehiculosAll: any[] = [];
  contenedoresAll: any[] = [];
  conductoresAll: any[] = [];
  afiliadosAll: any[] = [];

  // Controls
  empresaFilterCtrl = new FormControl('');
  auxiliarFilterCtrl = new FormControl('');
  clienteFilterCtrl = new FormControl('');
  operacionFilterCtrl = new FormControl('');
  origenFilterCtrl = new FormControl('');
  destinoFilterCtrl = new FormControl('');
  lineaFilterCtrl = new FormControl('');
  vehiculoFilterCtrl = new FormControl('');
  contenedorFilterCtrl = new FormControl('');
  conductorFilterCtrl = new FormControl('');
  afiliadoFilterCtrl = new FormControl('');

  filteredEmpresas$: Observable<any[]> = new Observable();
  filteredAuxiliares$: Observable<any[]> = new Observable();
  filteredClientes$: Observable<any[]> = new Observable();
  filteredOperaciones$: Observable<any[]> = new Observable();
  filteredOrigenes$: Observable<any[]> = new Observable();
  filteredDestinos$: Observable<any[]> = new Observable();
  filteredLineas$: Observable<any[]> = new Observable();
  filteredVehiculos$: Observable<any[]> = new Observable();
  filteredContenedores$: Observable<any[]> = new Observable();
  filteredConductores$: Observable<any[]> = new Observable();
  filteredAfiliados$: Observable<any[]> = new Observable();

  activeFilterCount = 0;

  columns: TableColumn[] = [
    { key: 'fecha', label: 'Fecha', format: 'date', sortable: true },
    { key: 'empresaTransporte', label: 'Empresa Transporte', sortable: true },
    { key: 'placa', label: 'Placa', format: 'placa' },
    { key: 'contenedor', label: 'Contenedor' },
    { key: 'cliente', label: 'Cliente', sortable: true },
    { key: 'linea', label: 'Línea' },
    { key: 'origen', label: 'Origen' },
    { key: 'destino', label: 'Destino' },
    { key: 'operacion', label: 'Operación' },
    { key: 'conductor', label: 'Conductor' },
    { key: 'estado', label: 'Estado' },
    { key: 'flete', label: 'Flete', format: 'currency', sortable: true },
    { key: 'afiliado', label: 'Afiliado' },
    { key: 'auxiliarTransporte', label: 'Auxiliar Transporte' },
    { key: 'transporteComida', label: 'T. y Comida', format: 'currency' },
    { key: 'observacion', label: 'Observación' },
  ];

  get actions() {
    const base: any[] = [];
    if (this.auth.hasRole([1, 2])) base.push({ label: 'Editar', action: 'edit' });
    if (this.auth.hasRole([1])) base.push({ label: 'Eliminar', action: 'delete', danger: true });
    return base;
  }

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

    // Agrega filtros del panel
    if (this.filters.fecha_desde) url += `&fecha_desde=${this.filters.fecha_desde}`;
    if (this.filters.fecha_hasta) url += `&fecha_hasta=${this.filters.fecha_hasta}`;
    if (this.filters.estado) url += `&estado=${this.filters.estado}`;
    if (this.filters.afiliado) url += `&afiliado=${this.filters.afiliado}`;
    if (this.filters.linea) url += `&linea=${this.filters.linea}`;
    if (this.filters.conductor) url += `&conductor=${this.filters.conductor}`;
    if (this.filters.placa) url += `&placa=${this.filters.placa}`;
    if (this.filters.empresa_transporte) url += `&empresa_transporte=${this.filters.empresa_transporte}`;
    if (this.filters.auxiliar) url += `&auxiliar=${this.filters.auxiliar}`;
    if (this.filters.contenedor) url += `&contenedor=${this.filters.contenedor}`;
    if (this.filters.origen) url += `&origen=${this.filters.origen}`;
    if (this.filters.destino) url += `&destino=${this.filters.destino}`;
    if (this.filters.cliente) url += `&cliente=${this.filters.cliente}`;
    if (this.filters.operacion) url += `&operacion=${this.filters.operacion}`;

    this.apiService.getAuth(url).subscribe({
      next: (res: any) => {
        this.rawTrips = res.data;
        this.total = res.total;
        this.movements = res.data.map((trip: any) => this.mapTrip(trip));

        // Construye opciones para los selects
        this.lineaOptions = [...new Set(res.data.map((t: any) => t.shippingLine?.name).filter(Boolean))] as string[];
        this.afiliadoOptions = [...new Set(res.data.map((t: any) => t.affiliate?.name).filter(Boolean))] as string[];

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  openFilterPanel(): void { this.filterOpen = true; }
  closeFilterPanel(): void { this.filterOpen = false; }

  applyFilters(): void {
    this.activeFilterCount = Object.values(this.filters).filter(v => v !== '').length;
    this.lastParams.page = 1;
    this.loadTrips({ ...this.lastParams, page: 1 });
    this.closeFilterPanel();
  }

  // Carga los catálogos para los filtros
  private loadFilterCatalogs(): void {
    this.apiService.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe((d: any) => {
      this.conductoresAll = d;
      this.filteredConductores$ = this.conductorFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.conductoresAll.filter(c => c.name?.toLowerCase().includes(q)) : this.conductoresAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.afiliadosAll = d;
      this.filteredAfiliados$ = this.afiliadoFilterCtrl.valueChanges.pipe(
        startWith(''),
        map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.afiliadosAll.filter(a => a.name?.toLowerCase().includes(q)) : this.afiliadosAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.TRANSPORT_COMPANIES.LIST).subscribe((d: any) => {
      this.empresasAll = d;
      this.filteredEmpresas$ = this.empresaFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.empresasAll.filter(e => e.name?.toLowerCase().includes(q)) : this.empresasAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.TRANSPORT_ASSISTANTS.LIST).subscribe((d: any) => {
      this.auxiliaresAll = d;
      this.filteredAuxiliares$ = this.auxiliarFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.auxiliaresAll.filter(a => a.name?.toLowerCase().includes(q)) : this.auxiliaresAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.CLIENTS.LIST).subscribe((d: any) => {
      this.clientesAll = d;
      this.filteredClientes$ = this.clienteFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.clientesAll.filter(c => c.name?.toLowerCase().includes(q)) : this.clientesAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.OPERATIONS.LIST).subscribe((d: any) => {
      this.operacionesAll = d;
      this.filteredOperaciones$ = this.operacionFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.operacionesAll.filter(o => o.name?.toLowerCase().includes(q)) : this.operacionesAll.slice();
        })
      );
    });

    this.apiService.get(ENDPOINTS.PATIOS.LIST).subscribe((d: any) => {
      this.patiosAll = d;
      this.filteredOrigenes$ = this.origenFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.patiosAll.filter(p => p.name?.toLowerCase().includes(q)) : this.patiosAll.slice();
        })
      );
      this.filteredDestinos$ = this.destinoFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.patiosAll.filter(p => p.name?.toLowerCase().includes(q)) : this.patiosAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.SHIPPING_LINES.LIST).subscribe((d: any) => {
      this.lineasAll = d;
      this.filteredLineas$ = this.lineaFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.lineasAll.filter(l => l.name?.toLowerCase().includes(q)) : this.lineasAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.CONTAINERS.LIST).subscribe((d: any) => {
      this.contenedoresAll = d;
      this.filteredContenedores$ = this.contenedorFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.contenedoresAll.filter(c => c.name?.toLowerCase().includes(q)) : this.contenedoresAll.slice();
        })
      );
    });

    this.apiService.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehiculosAll = d;
      this.filteredVehiculos$ = this.vehiculoFilterCtrl.valueChanges.pipe(
        startWith(''), map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q
            ? this.vehiculosAll.filter(vh => vh.plate?.toLowerCase().includes(q))
            : this.vehiculosAll.slice();
        })
      );
    });

    // Agrega esto al final de loadFilterCatalogs() para cada control
    this.conductorFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.conductor = '';
    });
    this.afiliadoFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.afiliado = '';
    });
    this.empresaFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.empresa_transporte = '';
    });
    this.auxiliarFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.auxiliar = '';
    });
    this.clienteFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.cliente = '';
    });
    this.operacionFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.operacion = '';
    });
    this.origenFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.origen = '';
    });
    this.destinoFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.destino = '';
    });
    this.lineaFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.linea = '';
    });
    this.vehiculoFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.placa = '';
    });
    this.contenedorFilterCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.filters.contenedor = '';
    });
  }

  ngOnInit(): void {
    this.loadFilterCatalogs();
  }

  // En clearFilters también resetea los controls
  clearFilters(): void {
    this.filters = {
      fecha_desde: '', fecha_hasta: '', estado: '',
      afiliado: '', linea: '', conductor: '', placa: '',
      empresa_transporte: '', auxiliar: '', contenedor: '',
      origen: '', destino: '', cliente: '', operacion: '',
    };
    this.conductorFilterCtrl.setValue('', { emitEvent: false });
    this.afiliadoFilterCtrl.setValue('', { emitEvent: false });
    this.empresaFilterCtrl.setValue('', { emitEvent: false });
    this.auxiliarFilterCtrl.setValue('', { emitEvent: false });
    this.clienteFilterCtrl.setValue('', { emitEvent: false });
    this.operacionFilterCtrl.setValue('', { emitEvent: false });
    this.origenFilterCtrl.setValue('', { emitEvent: false });
    this.destinoFilterCtrl.setValue('', { emitEvent: false });
    this.lineaFilterCtrl.setValue('', { emitEvent: false });
    this.vehiculoFilterCtrl.setValue('', { emitEvent: false });
    this.contenedorFilterCtrl.setValue('', { emitEvent: false });
    this.activeFilterCount = 0;
    this.loadTrips({ ...this.lastParams, page: 1 });
    this.filterOpen = false;
  }

  displayFn(field: string) {
    return (item: any): string => item ? (item[field] ?? '') : '';
  }

  onSelectConductor(item: any): void { this.filters.conductor = item.id; }
  onSelectAfiliado(item: any): void { this.filters.afiliado = item.id; }
  onSelectEmpresa(item: any): void { this.filters.empresa_transporte = item.id; }
  onSelectAuxiliar(item: any): void { this.filters.auxiliar = item.id; }
  onSelectCliente(item: any): void { this.filters.cliente = item.id; }
  onSelectOperacion(item: any): void { this.filters.operacion = item.id; }
  onSelectOrigen(item: any): void { this.filters.origen = item.id; }
  onSelectDestino(item: any): void { this.filters.destino = item.id; }
  onSelectLinea(item: any): void { this.filters.linea = item.id; }
  onSelectVehiculo(item: any): void { this.filters.placa = item.id; }
  onSelectContenedor(item: any): void { this.filters.contenedor = item.id; }

  private statusMap: Record<string, string> = {
    '1': 'Lleno', '2': 'Vacío', '3': 'Carga suelta',
  };

  private mapTrip(trip: any): any {
    return {
      id: trip.id,
      fecha: trip.trip_date,
      empresaTransporte: trip.transportCompany?.name || '',
      placa: trip.vehicle?.plate || '',
      contenedor: trip.container?.number || '',
      cliente: trip.client?.name || '',
      linea: trip.shippingLine?.name || '',
      origen: trip.origin?.name || '',
      destino: trip.destination?.name || '',
      operacion: trip.operation?.name || '',
      conductor: trip.driver?.name || '',
      estado: this.statusMap[trip.client_status] || trip.client_status || '',
      flete: Number(trip.freight_value || 0),
      comisionPagada: Number(trip.commission_paid || 0),
      afiliado: trip.affiliate?.name || '',
      auxiliarTransporte: trip.transportAssistant?.name || '',
      transporteComida: Number(trip.transport_food_value || 0),
      observacion: trip.observations || '',
    };
  }

  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit') this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(mov: any): void {
    const raw = this.rawTrips.find(t => String(t.id) === String(mov.id));
    if (!raw) return;
    const ref = this.dialog.open(TransportMovementFormModalComponent, {
      data: raw, panelClass: 'dialog-panel', width: '860px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.loadTrips(this.lastParams));
    });
  }

  confirmDelete(mov: any): void {
    if (!confirm(`¿Eliminar el movimiento #${mov.id}?`)) return;
    this.apiService.deleteAuth(ENDPOINTS.TRIPS.DELETE(mov.id)).subscribe({
      next: () => { this.toast.success('Movimiento eliminado'); setTimeout(() => this.loadTrips(this.lastParams)); },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  openModal(): void {
    const ref = this.dialog.open(TransportMovementFormModalComponent, {
      data: null, panelClass: 'dialog-panel', width: '860px', maxHeight: '90vh',
    });
    ref.afterClosed().subscribe(result => {
      if (result?.saved) setTimeout(() => this.loadTrips(this.lastParams));
    });
  }

  // Detecta cuando el usuario borra manualmente el input
  onFilterInputChange(ctrl: FormControl, filterKey: keyof typeof this.filters): void {
    const val = ctrl.value;
    // Si el valor es string (el usuario escribió/borró), limpia el filtro
    if (typeof val === 'string') {
      (this.filters as any)[filterKey] = '';
    }
  }
}