// transport-movement-form-modal.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';

@Component({
  selector: 'app-transport-movement-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './transport-movement-form-modal.html',
  styleUrl: './transport-movement-form-modal.scss'
})
export class TransportMovementFormModalComponent implements OnInit {

  private dialogRef = inject(MatDialogRef<TransportMovementFormModalComponent>);
  private api = inject(ApiService);

  // --- Catálogos crudos desde la API ---
  drivers: any[] = [];
  patios: any[] = [];
  shippingLines: any[] = [];
  transportAssistants: any[] = [];
  transportCompanies: any[] = [];
  clients: any[] = [];
  affiliates: any[] = [];
  containers: any[] = [];
  freights: any[] = [];
  operations: any[] = [];
  vehicles: any[] = [];

  // --- FormControls para cada autocomplete ---
  conductorCtrl = new FormControl('');
  patioCtrl = new FormControl('');
  lineaCtrl = new FormControl('');
  auxiliarTransporteCtrl = new FormControl('');
  empresaTransporteCtrl = new FormControl('');
  clienteCtrl = new FormControl('');
  afiliadoCtrl = new FormControl('');
  contenedorCtrl = new FormControl<any>('');
  fleteCtrl = new FormControl('');
  operacionCtrl = new FormControl('');
  vehiclesCtrl = new FormControl('');
  origenCtrl = new FormControl('');
  destinoCtrl = new FormControl('');

  // --- Observables filtrados ---
  filteredDrivers$!: Observable<any[]>;
  filteredPatios$!: Observable<any[]>;
  filteredShippingLines$!: Observable<any[]>;
  filteredTransportAssistants$!: Observable<any[]>;
  filteredTransportCompanies$!: Observable<any[]>;
  filteredClients$!: Observable<any[]>;
  filteredAffiliates$!: Observable<any[]>;
  filteredContainers$!: Observable<any[]>;
  filteredFreights$!: Observable<any[]>;
  filteredOperations$!: Observable<any[]>;
  filteredVehicles$!: Observable<any[]>;
  filteredPatiosDestino$!: Observable<any[]>;

  freightResolved = false;

  form = {
    fecha: '',
    cliente: '',
    linea: '',
    origen: '',
    destino: '',
    empresaTransporte: '',
    afiliado: '',
    auxiliarTransporte: '',
    vehiculo: '',
    conductor: '',
    contenedor: '',
    operacion: '',
    estado: '',
    estadoTrabajo: '',
    flete: 0,
    comisionPagada: 0,
    transporteComida: 0,
    observacion: '',
    fechaFacturar: ''
  };

  ngOnInit(): void {
    this.loadCatalogs();
  }

  private loadCatalogs(): void {
    this.api.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe((d: any) => {
      this.drivers = d;
      this.filteredDrivers$ = this.buildFilter(this.conductorCtrl, this.drivers, 'name');
    });

    this.api.get(ENDPOINTS.PATIOS.LIST).subscribe((d: any) => {
      this.patios = d;
      this.filteredPatios$ = this.buildFilter(this.origenCtrl, this.patios, 'name');
      this.filteredPatiosDestino$ = this.buildFilter(this.destinoCtrl, this.patios, 'name');
    });

    this.api.getAuth(ENDPOINTS.SHIPPING_LINES.LIST).subscribe((d: any) => {
      this.shippingLines = d;
      this.filteredShippingLines$ = this.buildFilter(this.lineaCtrl, this.shippingLines, 'name');
    });

    this.api.getAuth(ENDPOINTS.TRANSPORT_ASSISTANTS.LIST).subscribe((d: any) => {
      this.transportAssistants = d;
      this.filteredTransportAssistants$ = this.buildFilter(this.auxiliarTransporteCtrl, this.transportAssistants, 'name');
    });

    this.api.getAuth(ENDPOINTS.TRANSPORT_COMPANIES.LIST).subscribe((d: any) => {
      this.transportCompanies = d;
      this.filteredTransportCompanies$ = this.buildFilter(this.empresaTransporteCtrl, this.transportCompanies, 'name');
    });

    this.api.getAuth(ENDPOINTS.CLIENTS.LIST).subscribe((d: any) => {
      this.clients = d;
      this.filteredClients$ = this.buildFilter(this.clienteCtrl, this.clients, 'name');
    });

    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = d;
      this.filteredAffiliates$ = this.buildFilter(this.afiliadoCtrl, this.affiliates, 'name');
    });

    this.api.getAuth(ENDPOINTS.CONTAINERS.LIST).subscribe((d: any) => {
      this.containers = d;
      this.filteredContainers$ = this.buildFilter(this.contenedorCtrl, this.containers, 'number');
    });

    this.api.getAuth(ENDPOINTS.FREIGHTS.LIST).subscribe((d: any) => {
      this.freights = d;
      this.filteredFreights$ = this.buildFilter(this.fleteCtrl, this.freights, 'name');
    });

    this.api.getAuth(ENDPOINTS.OPERATIONS.LIST).subscribe((d: any) => {
      this.operations = d;
      this.filteredOperations$ = this.buildFilter(this.operacionCtrl, this.operations, 'name');
    });

    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = d;
      this.filteredVehicles$ = this.buildFilter(this.vehiclesCtrl, this.vehicles, 'plate');
    });
  }

  /** Filtra un array por el campo `field` según lo que escriba el usuario */
  private buildFilter(ctrl: FormControl, list: any[], field: string): Observable<any[]> {
    return ctrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const q = (value ?? '').toString().toLowerCase();
        return q ? list.filter(item => item[field]?.toLowerCase().includes(q)) : list.slice();
      })
    );
  }

  /** Muestra el nombre en el input después de seleccionar */
  displayFn(field: string) {
    return (item: any): string => item ? (item[field] ?? '') : '';
  }

  /** Al seleccionar una opción, guarda el id (o el campo que necesites) en form */
  onSelect(formKey: keyof typeof this.form, item: any, valueKey = 'id'): void {
    (this.form as any)[formKey] = item[valueKey];
  }

  close(): void {
    this.dialogRef.close();
  }

  resolveFreight(): void {
    const origenId = this.form.origen;
    const destinoId = this.form.destino;
    const empresaId = this.form.empresaTransporte;

    if (!origenId || !destinoId || !empresaId) return;

    this.api.getAuth(ENDPOINTS.FREIGHTS.LIST).subscribe((data: any) => {
      const freights = data as any[];
      const match = freights.find(f =>
        String(f.origin_id) === String(origenId) &&
        String(f.destination_id) === String(destinoId) &&
        String(f.transport_company_id) === String(empresaId)
      );

      if (match) {
        this.form.flete = match.freight;
        this.freightResolved = true;
      } else {
        this.form.flete = 0;
        this.freightResolved = false;
      }
    });
  }

  saving = false;

save(): void {
  if (this.saving) return;
  this.saving = true;

  // Si seleccionó del autocomplete, el valor es el objeto completo
  const ctrlValue = this.contenedorCtrl.value;
  
  // Caso 1: seleccionó del autocomplete → ya tiene el id
  if (ctrlValue && typeof ctrlValue === 'object' && ctrlValue.id) {
    this.submitTrip(ctrlValue.id);
    return;
  }

  // Caso 2: escribió un número manualmente → buscar o crear
  const containerNumber = typeof ctrlValue === 'string' 
    ? ctrlValue.trim() 
    : '';

  if (!containerNumber) {
    this.submitTrip(null);
    return;
  }

  this.api.postAuth(ENDPOINTS.CONTAINERS.FIND_OR_CREATE, {
    number: containerNumber
  }).subscribe({
    next: (res: any) => {
      this.submitTrip(res.container.id);
    },
    error: () => {
      this.saving = false;
      console.error('Error al resolver contenedor');
    }
  });
}

private submitTrip(containerId: number | null): void {

  const date = new Date(this.form.fecha);

  const payload = {
    trip_date:              this.form.fecha,
    transport_company_id:   this.form.empresaTransporte  || null,
    vehicle_id:             this.form.vehiculo           || null,
    driver_id:              this.form.conductor          || null,
    affiliate_id:           this.form.afiliado           || null,
    transport_assistant_id: this.form.auxiliarTransporte || null,
    shipping_line_id:       this.form.linea              || null,
    origin_id:              this.form.origen             || null,
    destination_id:         this.form.destino            || null,
    container_number_id:    containerId,
    operation_id:           this.form.operacion          || null,
    client_status:          this.form.estado             || null,
    freight_value:          this.form.flete              || 0,
    commission_paid:        this.form.comisionPagada     || 0,
    work_status:            this.form.estadoTrabajo      || null,
    transport_food_value:   this.form.transporteComida   || 0,
    observations:           this.form.observacion        || null,
    invoice_send_date:      this.form.fechaFacturar      || null,
  };

  this.api.postAuth(ENDPOINTS.TRIPS.CREATE, payload).subscribe({
    next: (res: any) => {
      this.saving = false;
      this.dialogRef.close({ saved: true, data: res });
    },
    error: (err) => {
      this.saving = false;
      console.error('Error al guardar viaje:', err);
    }
  });
}

private getWeek(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff  = date.getTime() - start.getTime();
  return Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
}
}