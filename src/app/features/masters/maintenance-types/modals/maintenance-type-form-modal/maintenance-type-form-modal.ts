import { Component, OnInit, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-maintenance-type-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-type-form-modal.html',
  styleUrls: ['./maintenance-type-form-modal.scss'],
})
export class MaintenanceTypeFormModal implements OnInit {

  private api   = inject(ApiService);
  private toast = inject(ToastService);
  private ref   = inject(MatDialogRef<MaintenanceTypeFormModal>);

  saving = false;
  form = { name: '' };

  get isEdit(): boolean { return !!this.data?.id; }
  get title():  string  { return this.isEdit ? 'Editar Tipo' : 'Nuevo Tipo de Mantenimiento'; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    if (this.isEdit) this.form.name = this.data.name;
  }

  save(): void {
    if (!this.form.name.trim()) {
      this.toast.error('El nombre es obligatorio');
      return;
    }
    this.saving = true;

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.MAINTENANCE_TYPES.UPDATE(this.data.id), this.form)
      : this.api.postAuth(ENDPOINTS.MAINTENANCE_TYPES.CREATE, this.form);

    request$.subscribe({
      next: () => {
        this.toast.success(this.isEdit ? 'Tipo actualizado' : 'Tipo creado');
        this.ref.close({ saved: true });
      },
      error: () => { this.toast.error('Error al guardar'); this.saving = false; }
    });
  }

  close(): void { this.ref.close(); }
}