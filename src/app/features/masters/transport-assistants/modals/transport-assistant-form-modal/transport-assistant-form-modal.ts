import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-transport-assistant-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './transport-assistant-form-modal.html',
  styleUrl: './transport-assistant-form-modal.scss',
})
export class TransportAssistantFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<TransportAssistantFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  form = {
    document_number: '' as any,
    name:            '',
    phone:           '',
    active:          true,
  };

  ngOnInit(): void {
    if (this.isEdit) {
      this.form = {
        document_number: this.data.document_number ?? '',
        name:            this.data.name            ?? '',
        phone:           this.data.phone           ?? '',
        active:          this.data.active          ?? true,
      };
    }
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.name.trim())      this.fieldErrors['name']            = true;
    if (!this.form.document_number)  this.fieldErrors['document_number'] = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    this.saving = true;

    const payload = {
      document_number: this.form.document_number || null,
      name:            this.form.name.trim(),
      phone:           this.form.phone.trim() || null,
      active:          this.form.active,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.TRANSPORT_ASSISTANTS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.TRANSPORT_ASSISTANTS.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Auxiliar actualizado' : 'Auxiliar creado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          this.fieldErrors['document_number'] = true;
          this.toast.error(err.error?.error || 'Documento duplicado');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}