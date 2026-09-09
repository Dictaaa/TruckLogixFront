import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-trailer-plate-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trailer-plate-form-modal.html',
  styleUrls: ['./trailer-plate-form-modal.scss'],
})
export class TrailerPlateFormModal implements OnInit {

  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private ref   = inject(MatDialogRef<TrailerPlateFormModal>);

  vehicles: any[] = [];
  saving = false;

  form = {
    plate:      '',
    vehicle_id: null as number | null,
  };

  get isEdit(): boolean { return !!this.data?.id; }
  get title():  string  { return this.isEdit ? 'Editar Placa Trailer' : 'Nueva Placa Trailer'; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = Array.isArray(d) ? d : (d.data ?? []);
    });
    if (this.isEdit) {
      this.form.plate      = this.data.plate;
      this.form.vehicle_id = this.data.vehicle_id ?? null;
    }
  }

  save(): void {
    if (!this.form.plate.trim()) {
      this.toast.error('La placa es obligatoria');
      return;
    }
    this.saving = true;

    const payload = {
      plate:      this.form.plate.trim().toUpperCase(),
      vehicle_id: this.form.vehicle_id || null,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.TRAILER_PLATES.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.TRAILER_PLATES.CREATE, payload);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Trailer actualizado' : 'Trailer creado');
        this.ref.close({ saved: true });
      },
      error: () => { this.toast.error('Error al guardar'); this.saving = false; }
    });
  }

  close(): void { this.ref.close(); }
}