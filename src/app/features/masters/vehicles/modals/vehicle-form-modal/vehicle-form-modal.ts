import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-vehicle-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './vehicle-form-modal.html',
  styleUrl: './vehicle-form-modal.scss',
})
export class VehicleFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<VehicleFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  form = {
    plate:            '',
    soat_expiration:  '',
    rtm_expiration:   '',
    active:           1,
  };

  ngOnInit(): void {
    if (this.isEdit) {
      this.form = {
        plate:           this.data.plate           ?? '',
        soat_expiration: this.data.soat_expiration
          ? this.data.soat_expiration.substring(0, 10) : '',
        rtm_expiration:  this.data.rtm_expiration
          ? this.data.rtm_expiration.substring(0, 10)  : '',
        active:          this.data.active          ?? 1,
      };
    }
  }

  close(): void { this.dialogRef.close(); }

  isExpiringSoon(date: string): boolean {
    if (!date) return false;
    const diff = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }

  isExpired(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.plate.trim())       this.fieldErrors['plate']           = true;
    if (!this.form.soat_expiration)    this.fieldErrors['soat_expiration'] = true;
    if (!this.form.rtm_expiration)     this.fieldErrors['rtm_expiration']  = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    this.saving = true;

    const payload = {
      plate:           this.form.plate.trim().toUpperCase(),
      soat_expiration: this.form.soat_expiration,
      rtm_expiration:  this.form.rtm_expiration,
      active:          this.form.active,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.VEHICLES.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.VEHICLES.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Vehículo actualizado' : 'Vehículo creado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          this.fieldErrors['plate'] = true;
          this.toast.error(err.error?.error || 'Placa duplicada');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}