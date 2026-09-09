import { Component, OnInit, Inject, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-maintenance-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-form-modal.html',
  styleUrls: ['./maintenance-form-modal.scss'],
})
export class MaintenanceFormModalComponent implements OnInit {

  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private ref   = inject(MatDialogRef<MaintenanceFormModalComponent>);
  private cdr   = inject(ChangeDetectorRef);

  // Catálogos
  vehicles:         any[] = [];
  affiliates:       any[] = [];
  brands:           any[] = [];
  maintenanceTypes: any[] = [];
  trailerPlates:    any[] = [];

  saving = false;

  // Agregar maestros inline
  showNewBrand   = false;
  showNewType    = false;
  showNewTrailer = false;
  newBrandName   = '';
  newTypeName    = '';
  newTrailerPlate = '';

  form: any = {
    entry_date:          '',
    exit_date:           '',
    vehicle_id:          null,
    affiliate_id:        null,
    brand_id:            null,
    maintenance_type_id: null,
    trailer_plate_id:    null,
    operation_detail:    '',
    labor_cost:          0,
    parts_cost:          0,
  };

  get totalCosto(): number {
    return Number(this.form.labor_cost || 0) + Number(this.form.parts_cost || 0);
  }

  get isEdit(): boolean { return !!this.data?.id; }
  get title():  string  { return this.isEdit ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.loadCatalogs();
    if (this.isEdit) this.fillForm(this.data);
  }

  private loadCatalogs(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = Array.isArray(d) ? d : (d.data ?? []);
      this.cdr.detectChanges();
    });
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = Array.isArray(d) ? d : (d.data ?? []);
      this.cdr.detectChanges();
    });
    this.api.getAuth(ENDPOINTS.MAINTENANCES.BRANDS).subscribe((d: any) => {
      this.brands = d;
      this.cdr.detectChanges();
    });
    this.api.getAuth(ENDPOINTS.MAINTENANCES.TYPES).subscribe((d: any) => {
      this.maintenanceTypes = d;
      this.cdr.detectChanges();
    });
    this.api.getAuth(ENDPOINTS.MAINTENANCES.TRAILER_PLATES).subscribe((d: any) => {
      this.trailerPlates = d;
      this.cdr.detectChanges();
    });
  }

  // Al seleccionar placa → auto-llenar afiliado desde vehicles.company_id
  onVehicleChange(): void {
    const vehicle = this.vehicles.find(v => String(v.id) === String(this.form.vehicle_id));
    if (vehicle?.company_id) {
      this.form.affiliate_id = vehicle.company_id; // vehicles.company_id = affiliates.id
    }
  }

  private fillForm(data: any): void {
    this.form = {
      entry_date:          data.entry_date          || '',
      exit_date:           data.exit_date           || '',
      vehicle_id:          data.vehicle_id          || null,
      affiliate_id:        data.affiliate_id        || null,
      brand_id:            data.brand_id            || null,
      maintenance_type_id: data.maintenance_type_id || null,
      trailer_plate_id:    data.trailer_plate_id    || null,
      operation_detail:    data.operation_detail    || '',
      labor_cost:          Number(data.labor_cost   || 0),
      parts_cost:          Number(data.parts_cost   || 0),
    };
  }

  // ─── Agregar marca inline ──────────────────────────────────────────────────
  saveBrand(): void {
    if (!this.newBrandName.trim()) return;
    this.api.postAuth(ENDPOINTS.MAINTENANCES.CREATE_BRAND, { name: this.newBrandName }).subscribe({
      next: (b: any) => {
        this.brands.push(b);
        this.form.brand_id = b.id;
        this.showNewBrand  = false;
        this.newBrandName  = '';
        this.toast.success('Marca creada');
      },
      error: () => this.toast.error('Error al crear marca')
    });
  }

  // ─── Agregar tipo MTTO inline ──────────────────────────────────────────────
  saveType(): void {
    if (!this.newTypeName.trim()) return;
    this.api.postAuth(ENDPOINTS.MAINTENANCES.CREATE_TYPE, { name: this.newTypeName }).subscribe({
      next: (t: any) => {
        this.maintenanceTypes.push(t);
        this.form.maintenance_type_id = t.id;
        this.showNewType = false;
        this.newTypeName = '';
        this.toast.success('Tipo creado');
      },
      error: () => this.toast.error('Error al crear tipo')
    });
  }

  // ─── Agregar placa trailer inline ──────────────────────────────────────────
  saveTrailerPlate(): void {
    if (!this.newTrailerPlate.trim()) return;
    this.api.postAuth(ENDPOINTS.MAINTENANCES.CREATE_TRAILER_PLATE, {
      plate: this.newTrailerPlate.toUpperCase()
    }).subscribe({
      next: (p: any) => {
        this.trailerPlates.push(p);
        this.form.trailer_plate_id = p.id;
        this.showNewTrailer  = false;
        this.newTrailerPlate = '';
        this.toast.success('Placa trailer creada');
      },
      error: () => this.toast.error('Error al crear placa trailer')
    });
  }

  save(): void {
    if (!this.form.entry_date || !this.form.vehicle_id) {
      this.toast.error('Fecha de ingreso y placa son obligatorios');
      return;
    }

    this.saving = true;
    const payload = { ...this.form };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.MAINTENANCES.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.MAINTENANCES.CREATE, payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Mantenimiento actualizado' : 'Mantenimiento creado');
        this.ref.close({ saved: true });
      },
      error: (err: any) => {
        this.toast.error(err?.error?.error || 'Error al guardar');
        this.saving = false;
      }
    });
  }

  close(): void { this.ref.close(); }
}