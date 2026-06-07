import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-container-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './container-form-modal.html',
  styleUrl: './container-form-modal.scss',
})
export class ContainerFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<ContainerFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  containerSizes = [
    { id: 1, label: "20'" },
    { id: 2, label: "40'" },
    { id: 3, label: "45'" },
  ];

  form = {
    number:            '',
    container_size_id: '' as any,
    active:            true,
  };

  ngOnInit(): void {
    if (this.isEdit) {
      this.form = {
        number:            this.data.number            ?? '',
        container_size_id: this.data.container_size_id ?? '',
        active:            this.data.active            ?? true,
      };
    }
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.number.trim()) this.fieldErrors['number'] = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('El número de contenedor es obligatorio');
      return;
    }

    this.saving = true;

    const payload = {
      number:            this.form.number.trim().toUpperCase(),
      container_size_id: this.form.container_size_id || null,
      active:            this.form.active,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.CONTAINERS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.CONTAINERS.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Contenedor actualizado' : 'Contenedor creado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          this.fieldErrors['number'] = true;
          this.toast.error(err.error?.error || 'Número de contenedor duplicado');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}