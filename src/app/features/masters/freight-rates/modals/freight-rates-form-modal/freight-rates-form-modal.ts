import { Component, inject, OnInit, Inject } from '@angular/core';
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
  selector: 'app-freight-rates-form-modal',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule, MatAutocompleteModule,
  ],
  templateUrl: './freight-rates-form-modal.html',
  styleUrl: './freight-rates-form-modal.scss',
})
export class FreightRatesFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<FreightRatesFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);

  // Recibe el item si es edición, null si es creación
  data              = inject(MAT_DIALOG_DATA); 

  get isEdit(): boolean { return !!this.data?.id; }

  patios:             any[] = [];
  transportCompanies: any[] = [];

  empresaCtrl = new FormControl('');
  origenCtrl  = new FormControl('');
  destinoCtrl = new FormControl('');

  filteredCompanies$!: Observable<any[]>;
  filteredOrigen$!:    Observable<any[]>;
  filteredDestino$!:   Observable<any[]>;

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  form = {
    transport_company_id: '' as any,
    origin_id:            '' as any,
    destination_id:       '' as any,
    freight:              0,
    condition_id:            '' as any,  // ← nuevo
    container_size_id:                 '' as any,  // ← nuevo
    active:               true,
  };

  ngOnInit(): void {
    this.loadCatalogs();
  }

  private loadCatalogs(): void {
  // Pre-carga inmediata del form (no depende de la API)
  if (this.isEdit) {
    this.form = {
      transport_company_id: this.data.transport_company_id,
      origin_id:            this.data.origin_id,
      destination_id:       this.data.destination_id,
      freight:              this.data.freight,
      condition_id:            this.data.condition_id  ? String(this.data.condition_id)  : '',
      container_size_id:                 this.data.container_size_id       ? String(this.data.container_size_id)       : '',
      active:               this.data.active,
    };
  }
    this.api.getAuth(ENDPOINTS.TRANSPORT_COMPANIES.LIST).subscribe((d: any) => {
  this.transportCompanies = d;
  this.filteredCompanies$ = this.buildFilter(this.empresaCtrl, this.transportCompanies, 'name');

  if (this.isEdit && this.data.transportCompany) {
    this.empresaCtrl.setValue(this.data.transportCompany, { emitEvent: false });
  }
});

this.api.get(ENDPOINTS.PATIOS.LIST).subscribe((d: any) => {
  this.patios = d;
  this.filteredOrigen$  = this.buildFilter(this.origenCtrl,  this.patios, 'name');
  this.filteredDestino$ = this.buildFilter(this.destinoCtrl, this.patios, 'name');

  if (this.isEdit) {
    if (this.data.origin)      this.origenCtrl.setValue(this.data.origin,      { emitEvent: false });
    if (this.data.destination) this.destinoCtrl.setValue(this.data.destination, { emitEvent: false });
  }
});

    // Pre-carga el formulario si es edición
    if (this.isEdit) {
      this.form = {
        transport_company_id: this.data.transport_company_id,
        origin_id:            this.data.origin_id,
        destination_id:       this.data.destination_id,
        freight:              this.data.freight,
        condition_id:         this.data.condition_id  ? String(this.data.condition_id)  : '',
        container_size_id:    this.data.container_size_id       ? String(this.data.container_size_id)       : '',
        active:               this.data.active,
      };
    }
  }

  private buildFilter(ctrl: FormControl, list: any[], field: string): Observable<any[]> {
    return ctrl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const q = (value ?? '').toString().toLowerCase();
        return q ? list.filter(i => i[field]?.toLowerCase().includes(q)) : list.slice();
      })
    );
  }

  displayFn(field: string) {
    return (item: any): string => item ? (item[field] ?? '') : '';
  }

  onSelect(formKey: keyof typeof this.form, item: any): void {
    (this.form as any)[formKey] = item.id;
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    this.fieldErrors = {};
  if (!this.form.transport_company_id) this.fieldErrors['empresa']   = true;
  if (!this.form.origin_id)            this.fieldErrors['origen']    = true;
  if (!this.form.destination_id)       this.fieldErrors['destino']   = true;
  if (!this.form.freight)              this.fieldErrors['freight']   = true;
  if (!this.form.condition_id)            this.fieldErrors['condition'] = true;
  if (!this.form.container_size_id)                 this.fieldErrors['size']      = true;

  if (Object.keys(this.fieldErrors).length > 0) {
    this.toast.error('Completa todos los campos obligatorios');
    return;
  }

    this.saving = true;

    const request$ = this.isEdit
      ? this.api.putAuth(ENDPOINTS.FREIGHTS.UPDATE(this.data.id), this.form)
      : this.api.postAuth(ENDPOINTS.FREIGHTS.CREATE, this.form);

    request$.subscribe({
      next: (res: any) => {
        this.saving = false;
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err) => {
        this.saving = false;
        console.error('Error al guardar tarifa:', err);
      }
    });
  }
}