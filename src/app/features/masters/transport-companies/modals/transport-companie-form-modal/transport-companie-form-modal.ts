import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-transport-companie-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './transport-companie-form-modal.html',
  styleUrl: './transport-companie-form-modal.scss',
})
export class TransportCompanieFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<TransportCompanieFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  form = {
    nit:    '',
    name:   '',
    active: true,
  };

  ngOnInit(): void {
    if (this.isEdit) {
      this.form = {
        nit:    this.data.nit    ?? '',
        name:   this.data.name   ?? '',
        active: this.data.active ?? true,
      };
    }
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.name.trim()) this.fieldErrors['name'] = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('El nombre es obligatorio');
      return;
    }

    this.saving = true;

    const payload = {
      nit:    this.form.nit.trim()  || null,
      name:   this.form.name.trim(),
      active: this.form.active,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.TRANSPORT_COMPANIES.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.TRANSPORT_COMPANIES.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Empresa actualizada' : 'Empresa creada');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          this.fieldErrors['nit'] = true;
          this.toast.error(err.error?.error || 'NIT duplicado');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}