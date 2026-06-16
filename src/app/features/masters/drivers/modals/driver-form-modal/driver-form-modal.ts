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
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-driver-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './driver-form-modal.html',
  styleUrl: './driver-form-modal.scss',
})
export class DriverFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<DriverFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  private auth      = inject(AuthService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }
  get userCompanyId(): any { return this.auth.getUser()?.company_id ?? null; }
  //get showAfiliadoField(): boolean { return !this.userCompanyId; }
  get showAfiliadoField(): boolean { return this.userCompanyId == 2; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  affiliates:   any[] = [];
  afiliadoCtrl = new FormControl('');
  filteredAffiliates$!: Observable<any[]>;

  licenseCategories = [
    { id: 1, label: 'A1' }, { id: 2, label: 'A2' },
    { id: 3, label: 'B1' }, { id: 4, label: 'B2' },
    { id: 5, label: 'B3' }, { id: 6, label: 'C1' },
    { id: 7, label: 'C2' }, { id: 8, label: 'C3' },
  ];

  form = {
    name:                '',
    phone:               '' as any,
    document:            '' as any,
    license_category_id: '' as any,
    license_number:      '',
    license_expiration:  '',
    active:              true,
    company_id:          null as any,
  };

  ngOnInit(): void {
    this.loadAffiliates();

    if (this.isEdit) {
      this.form = {
        name:                this.data.name                ?? '',
        phone:               this.data.phone               ?? '',
        document:            this.data.document            ?? '',
        license_category_id: this.data.license_category_id ?? '',
        license_number:      this.data.license_number      ?? '',
        license_expiration:  this.data.license_expiration?.substring(0, 10) ?? '',
        active:              this.data.active              ?? true,
        company_id:          this.data.company_id          ?? null,
      };
      } else if (this.userCompanyId && this.userCompanyId != 2) {
  this.form.company_id = this.userCompanyId;
}
    // } else if (this.userCompanyId) {
    //   this.form.company_id = this.userCompanyId;
    // }
  }

  private loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = d;
      this.filteredAffiliates$ = this.afiliadoCtrl.valueChanges.pipe(
        startWith(''),
        map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.affiliates.filter(a => a.name?.toLowerCase().includes(q)) : this.affiliates.slice();
        })
      );
      if (this.isEdit && this.data.company_id) {
        const match = this.affiliates.find(a => String(a.id) === String(this.data.company_id));
        if (match) this.afiliadoCtrl.setValue(match, { emitEvent: false });
      }
    });
  }

  displayFn(item: any): string { return item ? (item.name ?? '') : ''; }
  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.name.trim()) this.fieldErrors['name']     = true;
    if (!this.form.document)    this.fieldErrors['document'] = true;
    if (!this.form.company_id)  this.fieldErrors['company_id'] = true;

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }

    this.saving = true;

    const payload = {
      name:                this.form.name.trim(),
      phone:               this.form.phone               || null,
      document:            this.form.document            || null,
      license_category_id: this.form.license_category_id || null,
      license_number:      this.form.license_number      || null,
      license_expiration:  this.form.license_expiration  || null,
      active:              this.form.active,
      company_id:          this.form.company_id,
    };

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.DRIVERS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.DRIVERS.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Conductor actualizado' : 'Conductor creado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        if (err.status === 409) {
          this.fieldErrors['document'] = true;
          this.toast.error(err.error?.error || 'Documento duplicado');
        } else {
          this.toast.error('Error al guardar');
        }
      }
    });
  }
}