import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatAutocompleteModule],
  templateUrl: './user-form-modal.html',
  styleUrl: './user-form-modal.scss',
})
export class UserFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<UserFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};
  showPassword = false;

  profiles = [
    { id: 1, label: 'Administrador' },
    { id: 2, label: 'Auxiliar' },
    { id: 3, label: 'Afiliado' },
    { id: 4, label: 'Coordinador de mantenimiento' },
  ];

  // Autocomplete afiliados
  affiliates: any[] = [];
  afiliadoCtrl = new FormControl('');
  filteredAffiliates$!: Observable<any[]>;

  form = {
    first_name:       '',
    last_name:        '',
    document_number:  '',
    email:            '',
    phone_number_id:  '' as any,
    role:             '' as any,
    company_id:       '' as any,  // afiliado
    password:         '',
    active:           true,
  };

  ngOnInit(): void {
    this.loadAffiliates();
    if (this.isEdit) {
      this.form = {
        first_name:      this.data.first_name       ?? '',
        last_name:       this.data.last_name        ?? '',
        document_number: this.data.document_number  ?? '',
        email:           this.data.email            ?? '',
        phone_number_id: this.data.phone_number_id  ?? '',
        role:            this.data.role             ?? '',
        company_id:      this.data.company_id       ?? '',
        password:        '', // no se pre-carga
        active:          this.data.active           ?? true,
      };
    }
  }

  private loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = d;
      this.filteredAffiliates$ = this.afiliadoCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const q = (value ?? '').toString().toLowerCase();
          return q ? this.affiliates.filter(a => a.name?.toLowerCase().includes(q)) : this.affiliates.slice();
        })
      );
      // Pre-carga afiliado si es edición
      if (this.isEdit && this.data.company_id) {
        const match = this.affiliates.find(a => a.id === this.data.company_id);
        if (match) this.afiliadoCtrl.setValue(match, { emitEvent: false });
      }
    });
  }

  displayFn(item: any): string {
    return item ? (item.name ?? '') : '';
  }

  onSelectAfiliado(item: any): void {
    this.form.company_id = item.id;
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.first_name.trim())    this.fieldErrors['first_name']      = true;
    if (!this.form.last_name.trim())     this.fieldErrors['last_name']       = true;
    if (!this.form.document_number)      this.fieldErrors['document_number'] = true;
    if (!this.form.email.trim())         this.fieldErrors['email']           = true;
    if (!this.form.role)                 this.fieldErrors['role']            = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    this.saving = true;

    const payload: any = {
      first_name:      this.form.first_name.trim(),
      last_name:       this.form.last_name.trim(),
      document_number: this.form.document_number,
      email:           this.form.email.trim(),
      phone_number_id: this.form.phone_number_id || null,
      role:            this.form.role,
      company_id:      this.form.company_id      || null,
      active:          this.form.active,
    };

    // Solo incluir password si viene escrito
    if (this.form.password.trim()) {
      payload.password = this.form.password;
    }

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.USERS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.USERS.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Usuario actualizado' : 'Usuario creado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          const msg = err.error?.error ?? '';
          if (msg.includes('email'))     this.fieldErrors['email']           = true;
          if (msg.includes('documento')) this.fieldErrors['document_number'] = true;
          this.toast.error(msg || 'Dato duplicado');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}