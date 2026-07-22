import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-fuel-log-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fuel-log-form-modal.html',
  styleUrls: ['./fuel-log-form-modal.scss'],
})
export class FuelLogFormModal implements OnInit {

  private api    = inject(ApiService);
  private toast  = inject(ToastService);
  private ref    = inject(MatDialogRef<FuelLogFormModal>);

  vehicles:   any[] = [];
  affiliates: any[] = [];
  saving = false;

  form: any = {
    fuel_date:        '',
    vehicle_id:       null,
    affiliate_id:     null,
    km_initial:       null,
    km_final:         null,
    gallons:          null,
    price_per_gallon: null,
    observations:     '',
  };

  // Calculado localmente para mostrar en tiempo real
  get kmRecorrido(): number {
    const ini = Number(this.form.km_initial || 0);
    const fin = Number(this.form.km_final   || 0);
    return fin > ini ? fin - ini : 0;
  }

  get totalValor(): number {
    const g = Number(this.form.gallons          || 0);
    const p = Number(this.form.price_per_gallon || 0);
    return g * p;
  }

  get isEdit(): boolean { return !!this.data?.id; }
  get title():  string  { return this.isEdit ? 'Editar Registro' : 'Nuevo Registro'; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.loadCatalogs();
    if (this.isEdit) this.fillForm(this.data);
  }

  private loadCatalogs(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = Array.isArray(d) ? d : (d.data ?? []);
    });
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = Array.isArray(d) ? d : (d.data ?? []);
    });
  }

  private fillForm(data: any): void {
    this.form = {
      fuel_date:        data.fuel_date        || '',
      vehicle_id:       data.vehicle_id       || null,
      affiliate_id:     data.affiliate_id     || null,
      km_initial:       data.km_initial       || null,
      km_final:         data.km_final         || null,
      gallons:          data.gallons          || null,
      price_per_gallon: data.price_per_gallon || null,
      observations:     data.observations     || '',
    };
  }

  save(): void {
    // Validaciones básicas
    if (!this.form.fuel_date || !this.form.vehicle_id || !this.form.gallons || !this.form.price_per_gallon) {
      this.toast.error('Completá los campos obligatorios');
      return;
    }
    if (Number(this.form.km_final) <= Number(this.form.km_initial)) {
      this.toast.error('Km final debe ser mayor que Km inicial');
      return;
    }

    this.saving = true;

    const payload = { ...this.form };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.FUEL_LOGS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.FUEL_LOGS.CREATE, payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Registro actualizado' : 'Registro creado');
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