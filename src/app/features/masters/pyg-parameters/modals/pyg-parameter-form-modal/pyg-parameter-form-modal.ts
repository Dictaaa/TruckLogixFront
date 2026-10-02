import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, startWith, map } from 'rxjs';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

export interface PygField {
  key: string;
  label: string;
  kind: 'money' | 'pct' | 'int';
  hint?: string;
}

export const PYG_MONTHLY_FIELDS: PygField[] = [
  { key: 'salary',          label: 'Salario conductor',  kind: 'money' },
  { key: 'commission_pct',  label: 'Comisión por viaje', kind: 'pct', hint: '% sobre el flete' },
  { key: 'social_security', label: 'Seguridad social',   kind: 'money' },
  { key: 'satellite',       label: 'Satelital',          kind: 'money' },
  { key: 'insurance',       label: 'Seguro todo riesgo', kind: 'money' },
  { key: 'affiliation',     label: 'Afiliación',         kind: 'money' },
  { key: 'parking',         label: 'Parqueadero',        kind: 'money' },
];

export const PYG_ANNUAL_FIELDS: PygField[] = [
  { key: 'soat',               label: 'SOAT',                 kind: 'money', hint: 'anual' },
  { key: 'tecnomecanica',      label: 'Tecnomecánica',        kind: 'money', hint: 'anual' },
  { key: 'annual_maintenance', label: 'Mantenimiento anual',  kind: 'money', hint: 'anual' },
  { key: 'dotacion',           label: 'Dotación',             kind: 'money', hint: 'por entrega' },
  { key: 'dotacion_times',     label: 'Entregas de dotación', kind: 'int',   hint: 'veces al año' },
];

@Component({
  selector: 'app-pyg-parameter-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatAutocompleteModule],
  templateUrl: './pyg-parameter-form-modal.html',
  styleUrl: './pyg-parameter-form-modal.scss',
})
export class PygParameterFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<PygParameterFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  get isEdit(): boolean { return !!this.data?.id; }
  get isGeneral(): boolean { return this.scope === 'general'; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  monthlyFields = PYG_MONTHLY_FIELDS;
  annualFields  = PYG_ANNUAL_FIELDS;
  allFields     = [...PYG_MONTHLY_FIELDS, ...PYG_ANNUAL_FIELDS];

  scope: 'general' | 'vehicle' = 'general';

  // Autocomplete vehículos
  vehicles: any[] = [];
  vehiculoCtrl = new FormControl<any>('');
  filteredVehicles$!: Observable<any[]>;

  // Valores que hoy aplican (para mostrar como referencia en los campos vacíos)
  current: Record<string, number> = {};

  form: Record<string, any> = {
    vehicle_id: '',
    valid_from: this.firstOfNextMonth(),
    notes: '',
  };

  ngOnInit(): void {
    this.allFields.forEach(f => this.form[f.key] = '');

    if (this.isEdit) {
      this.scope = this.data.vehicle_id ? 'vehicle' : 'general';
      this.form['vehicle_id'] = this.data.vehicle_id ?? '';
      this.form['valid_from'] = this.data.valid_from ?? '';
      this.form['notes']      = this.data.notes ?? '';
      this.allFields.forEach(f => {
        const v = this.data[f.key];
        this.form[f.key] = v === null || v === undefined ? '' : Number(v);
      });
    }

    this.loadVehicles();
    this.loadCurrent();
  }

  private firstOfNextMonth(): string {
    const d = new Date(Date.now() - 5 * 3600000);
    const y = d.getUTCMonth() === 11 ? d.getUTCFullYear() + 1 : d.getUTCFullYear();
    const m = d.getUTCMonth() === 11 ? 1 : d.getUTCMonth() + 2;
    return `${y}-${String(m).padStart(2, '0')}-01`;
  }

  private loadVehicles(): void {
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe((d: any) => {
      this.vehicles = (Array.isArray(d) ? d : d?.data ?? [])
        .slice().sort((a: any, b: any) => String(a.plate).localeCompare(String(b.plate)));

      this.filteredVehicles$ = this.vehiculoCtrl.valueChanges.pipe(
        startWith(''),
        map(value => {
          const q = (typeof value === 'string' ? value : '').toLowerCase();
          return q ? this.vehicles.filter(v => v.plate?.toLowerCase().includes(q)) : this.vehicles.slice();
        })
      );

      if (this.isEdit && this.data.vehicle_id) {
        const match = this.vehicles.find(v => v.id === this.data.vehicle_id);
        if (match) this.vehiculoCtrl.setValue(match, { emitEvent: false });
      }
    });

    // Si el usuario borra o escribe a mano, se pierde la selección
    this.vehiculoCtrl.valueChanges.subscribe(v => {
      if (typeof v === 'string') this.form['vehicle_id'] = '';
    });
  }

  /** Valores vigentes en la fecha elegida, para el alcance elegido */
  loadCurrent(): void {
    const date = this.form['valid_from'];
    if (!date) return;
    let url = `${ENDPOINTS.PYG_PARAMETERS.RESOLVED}?date=${date}`;
    if (!this.isGeneral && this.form['vehicle_id']) url += `&vehicle_id=${this.form['vehicle_id']}`;
    this.api.getAuth(url).subscribe((r: any) => { this.current = r?.values ?? {}; });
  }

  onScopeChange(): void {
    if (this.isGeneral) {
      this.form['vehicle_id'] = '';
      this.vehiculoCtrl.setValue('', { emitEvent: false });
    }
    this.loadCurrent();
  }

  displayFn(item: any): string {
    return item ? (item.plate ?? '') : '';
  }

  onSelectVehiculo(item: any): void {
    this.form['vehicle_id'] = item.id;
    this.fieldErrors['vehicle_id'] = false;
    this.loadCurrent();
  }

  placeholder(f: PygField): string {
    const v = this.current[f.key];
    if (v === undefined || v === null) return 'Hereda';
    return `Hereda: ${this.fmt(v, f.kind)}`;
  }

  fmt(v: number, kind: PygField['kind']): string {
    if (kind === 'pct') return `${v}%`;
    if (kind === 'int') return String(v);
    return '$ ' + Number(v).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
    if (!this.form['valid_from']) this.fieldErrors['valid_from'] = true;
    if (!this.isGeneral && !this.form['vehicle_id']) this.fieldErrors['vehicle_id'] = true;

    const hasValue = this.allFields.some(f => this.form[f.key] !== '' && this.form[f.key] !== null);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.toast.error('Completa los campos obligatorios');
      return;
    }
    if (!hasValue) {
      this.toast.error('Ingresa al menos un valor');
      return;
    }

    this.saving = true;

    const payload: any = {
      vehicle_id: this.isGeneral ? null : this.form['vehicle_id'],
      valid_from: this.form['valid_from'],
      notes:      (this.form['notes'] || '').trim() || null,
    };
    this.allFields.forEach(f => {
      const v = this.form[f.key];
      payload[f.key] = v === '' || v === null || v === undefined ? null : Number(v);
    });

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.PYG_PARAMETERS.UPDATE(this.data.id), payload)
      : this.api.postAuth(ENDPOINTS.PYG_PARAMETERS.CREATE, payload);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(this.isEdit ? 'Parámetros actualizados' : 'Parámetros creados');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        this.toast.error(err?.error?.error || 'Error al guardar');
      }
    });
  }
}