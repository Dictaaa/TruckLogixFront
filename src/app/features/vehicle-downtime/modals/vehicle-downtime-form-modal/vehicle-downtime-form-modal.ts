import { Component, OnInit, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';

@Component({
  selector: 'app-vehicle-downtime-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-downtime-form-modal.html',
  styleUrls: ['./vehicle-downtime-form-modal.scss'],
})
export class VehicleDowntimeFormModal implements OnInit {

  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private cdr   = inject(ChangeDetectorRef);
  private ref   = inject(MatDialogRef<VehicleDowntimeFormModal>);

  vehicles:  any[] = [];
  affiliates: any[] = [];
  statuses:  any[] = [];
  saving = false;

  // Nuevo estado inline
  showNewStatus = false;
  newStatusName = '';

  form: any = {
    vehicle_id:   null,
    affiliate_id: null,
    status_id:    null,
    date_from:    '',
    date_to:      '',        // si es rango
    observations: '',
  };

  get isEdit(): boolean { return !!this.data?.record?.id; }
  get title():  string  {
    return this.isEdit ? 'Editar Registro' : 'Registrar Día(s) No Trabajado(s)';
  }
  get isRange(): boolean {
    return !this.isEdit && !!this.form.date_to && this.form.date_to !== this.form.date_from;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { record: any; statuses: any[] }) {}

  ngOnInit(): void {
    this.statuses = this.data.statuses || [];

    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = Array.isArray(d) ? d : (d.data ?? []);
      this.cdr.detectChanges();
    });

    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = Array.isArray(d) ? d : (d.data ?? []);
      this.cdr.detectChanges();
    });

    if (this.isEdit) {
      const r = this.data.record;
      this.form = {
        vehicle_id:   r.vehicle_id   || null,
        affiliate_id: r.affiliate_id || null,
        status_id:    r.status_id    || null,
        date_from:    r.downtime_date || '',
        date_to:      '',
        observations: r.observations  || '',
      };
    }
  }

  // Al seleccionar vehículo → auto-llenar afiliado
  onVehicleChange(): void {
    const v = this.vehicles.find(x => String(x.id) === String(this.form.vehicle_id));
    if (v?.company_id) this.form.affiliate_id = v.company_id;
    this.cdr.detectChanges();
  }

  // Agregar estado inline
  saveStatus(): void {
    if (!this.newStatusName.trim()) return;
    this.api.postAuth(ENDPOINTS.VEHICLE_DOWNTIME.CREATE_STATUS, { name: this.newStatusName }).subscribe({
      next: (s: any) => {
        this.statuses.push(s);
        this.form.status_id = s.id;
        this.showNewStatus  = false;
        this.newStatusName  = '';
        this.toast.success('Estado creado');
        this.cdr.detectChanges();
      },
      error: () => this.toast.error('Error al crear estado')
    });
  }

  save(): void {
    if (!this.form.vehicle_id || !this.form.date_from || !this.form.status_id) {
      this.toast.error('Placa, fecha y estado son obligatorios');
      return;
    }
    this.saving = true;

    if (this.isEdit) {
      // Solo actualiza estado y observación
      const payload = {
        status_id:    this.form.status_id,
        observations: this.form.observations,
      };
      this.api.putAuth(ENDPOINTS.VEHICLE_DOWNTIME.UPDATE(this.data.record.id), payload).subscribe({
        next: () => { this.toast.success('Registro actualizado'); this.ref.close({ saved: true }); },
        error: () => { this.toast.error('Error al actualizar'); this.saving = false; }
      });
    } else {
      // Crea con rango (el backend genera un registro por día)
      const payload = {
        vehicle_id:   this.form.vehicle_id,
        affiliate_id: this.form.affiliate_id || null,
        status_id:    this.form.status_id,
        date_from:    this.form.date_from,
        date_to:      this.form.date_to || this.form.date_from,
        observations: this.form.observations || null,
      };
      this.api.postAuth(ENDPOINTS.VEHICLE_DOWNTIME.CREATE, payload).subscribe({
        next: (res: any) => {
          this.toast.success(res.message || 'Registros creados');
          this.ref.close({ saved: true });
        },
        error: (err: any) => {
          this.toast.error(err?.error?.error || 'Error al guardar');
          this.saving = false;
        }
      });
    }
  }

  close(): void { this.ref.close(); }
}