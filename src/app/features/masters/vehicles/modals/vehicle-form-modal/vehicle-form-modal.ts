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
  selector: 'app-vehicle-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './vehicle-form-modal.html',
  styleUrl: './vehicle-form-modal.scss',
})
export class VehicleFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<VehicleFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  private auth      = inject(AuthService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }

  // Si el usuario ya tiene company_id, no mostramos el campo afiliado
  get userCompanyId(): any { return this.auth.getUser()?.company_id ?? null; }
  //get showAfiliadoField(): boolean { return !this.userCompanyId; }
  get showAfiliadoField(): boolean { return this.userCompanyId == 2; }


  saving = false;
  fieldErrors: Record<string, boolean> = {};

  // Autocompletes
  affiliates:  any[] = [];
  drivers:     any[] = [];
  afiliadoCtrl = new FormControl('');
  conductorCtrl = new FormControl('');
  filteredAffiliates$!: Observable<any[]>;
  filteredDrivers$!:    Observable<any[]>;

  form = {
    plate:           '',
    soat_expiration: '',
    rtm_expiration:  '',
    active:          true,
    company_id:      null as any,
    driver_id:       null as any,
  };

  ngOnInit(): void {
    this.loadCatalogs();

    if (this.isEdit) {
      this.form = {
        plate:           this.data.plate            ?? '',
        soat_expiration: this.data.soat_expiration?.substring(0, 10) ?? '',
        rtm_expiration:  this.data.rtm_expiration?.substring(0, 10)  ?? '',
        active:          this.data.active           ?? true,
        company_id:      this.data.company_id       ?? null,
        driver_id:       this.data.driver_id        ?? null,
      };
      } else if (this.userCompanyId && this.userCompanyId != 2) {
  this.form.company_id = this.userCompanyId;
}
    // } else if (this.userCompanyId) {
    //   // Si el usuario tiene compañía, la asignamos automáticamente
    //   this.form.company_id = this.userCompanyId;
    // }
  }

  private loadCatalogs(): void {
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

    this.api.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe((d: any) => {
      this.drivers = d;
      this.filteredDrivers$ = this.conductorCtrl.valueChanges.pipe(
        startWith(''),
        map(v => {
          const q = (v ?? '').toString().toLowerCase();
          return q ? this.drivers.filter(dr => dr.name?.toLowerCase().includes(q)) : this.drivers.slice();
        })
      );
      if (this.isEdit && this.data.driver_id) {
        const match = this.drivers.find(dr => String(dr.id) === String(this.data.driver_id));
        if (match) this.conductorCtrl.setValue(match, { emitEvent: false });
      }
    });
  }

  displayFn(item: any): string { return item ? (item.name ?? '') : ''; }
  displayPlate(item: any): string { return item ? (item.plate ?? '') : ''; }

  close(): void { this.dialogRef.close(); }

  isExpiringSoon(date: string): boolean {
    if (!date) return false;
    const diff = (new Date(date).getTime() - Date.now()) / 86400000;
    return diff <= 30 && diff >= 0;
  }

  isExpired(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form.plate.trim())    this.fieldErrors['plate']           = true;
    if (!this.form.soat_expiration) this.fieldErrors['soat_expiration'] = true;
    if (!this.form.rtm_expiration)  this.fieldErrors['rtm_expiration']  = true;
    if (!this.form.company_id)      this.fieldErrors['company_id']      = true;
    if (!this.form.driver_id)       this.fieldErrors['driver_id']       = true;

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
      company_id:      this.form.company_id,
      driver_id:       this.form.driver_id,
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