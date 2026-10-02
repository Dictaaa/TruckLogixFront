import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';

export type BillingMode = 'temp' | 'po' | 'invoice' | 'revert';

interface ModalData {
  mode: BillingMode;
  tripIds: number[];
  count: number;
  value: number;
}

const TITLES: Record<BillingMode, string> = {
  temp:    'Generar OC temporal',
  po:      'Asignar orden de compra',
  invoice: 'Asignar factura',
  revert:  'Revertir paso',
};

@Component({
  selector: 'app-billing-action-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './billing-action-modal.html',
  styleUrl: './billing-action-modal.scss',
})
export class BillingActionModal implements OnInit {

  private dialogRef = inject(MatDialogRef<BillingActionModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  private cdr       = inject(ChangeDetectorRef);
  data: ModalData   = inject(MAT_DIALOG_DATA);

  get title(): string { return TITLES[this.data.mode]; }

  saving = false;
  fieldErrors: Record<string, boolean> = {};

  /** Advertencias del backend (409) que el usuario debe aceptar */
  warnings: any[] = [];
  /** Errores del backend (422) que impiden continuar */
  errors: any[] = [];
  needsConfirm = false;
  expanded = new Set<number>();

  tempOrders: any[] = [];

  form = {
    notes:          '',
    purchase_order: '',
    temp_order_id:  '' as number | '',
    invoice_number: '',
    invoice_date:   new Date(Date.now() - 5 * 3600000).toISOString().substring(0, 10),
    step:           'invoice' as 'invoice' | 'purchase_order' | 'temp_order',
    reason:         '',
  };

  revertSteps = [
    { value: 'invoice',        label: 'Quitar factura' },
    { value: 'purchase_order', label: 'Quitar orden de compra' },
    { value: 'temp_order',     label: 'Quitar OC temporal' },
  ];

  ngOnInit(): void {
    if (this.data.mode === 'po') {
      this.api.getAuth(`${ENDPOINTS.BILLING.TEMP_ORDERS}?pending=1`).subscribe((res: any) => {
        this.tempOrders = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      });
    }
  }

  /** Si el usuario cambia algo después de ver advertencias, hay que volver a validar */
  onFormChange(): void {
    if (this.needsConfirm || this.errors.length) {
      this.needsConfirm = false;
      this.warnings = [];
      this.errors = [];
    }
  }

  toggleTrips(i: number): void {
    this.expanded.has(i) ? this.expanded.delete(i) : this.expanded.add(i);
  }

  formatMoney(v: number): string {
    return '$ ' + Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  close(): void { this.dialogRef.close(); }

  private validate(): boolean {
    this.fieldErrors = {};
    if (this.data.mode === 'po' && !this.form.purchase_order.trim()) this.fieldErrors['purchase_order'] = true;
    if (this.data.mode === 'invoice' && !this.form.invoice_number.trim()) this.fieldErrors['invoice_number'] = true;
    if (this.data.mode === 'revert' && !this.form.reason.trim()) this.fieldErrors['reason'] = true;
    if (Object.keys(this.fieldErrors).length) {
      this.toast.error('Completa los campos obligatorios');
      return false;
    }
    return true;
  }

  submit(confirm = false): void {
    if (this.saving || !this.validate()) return;

    const base = { trip_ids: this.data.tripIds, confirm };
    let url = '';
    let payload: any = {};

    switch (this.data.mode) {
      case 'temp':
        url = ENDPOINTS.BILLING.TEMP_ORDERS;
        payload = { ...base, notes: this.form.notes.trim() || null };
        break;
      case 'po':
        url = ENDPOINTS.BILLING.PURCHASE_ORDERS;
        payload = {
          ...base,
          purchase_order: this.form.purchase_order.trim(),
          temp_order_id: this.form.temp_order_id || null,
        };
        break;
      case 'invoice':
        url = ENDPOINTS.BILLING.INVOICES;
        payload = { ...base, invoice_number: this.form.invoice_number.trim(), invoice_date: this.form.invoice_date };
        break;
      case 'revert':
        url = ENDPOINTS.BILLING.REVERT;
        payload = { trip_ids: this.data.tripIds, step: this.form.step, reason: this.form.reason.trim() };
        break;
    }

    this.saving = true;
    this.errors = [];

    this.api.postAuth(url, payload).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.toast.success(res?.message || 'Guardado');
        this.dialogRef.close({ saved: true, data: res });
      },
      error: (err: any) => {
        this.saving = false;
        const body = err?.error ?? {};
        if (err.status === 409 && body.requiresConfirmation) {
          this.warnings = body.warnings ?? [];
          this.needsConfirm = true;
        } else if (err.status === 422) {
          this.errors = body.errors ?? [];
          this.warnings = body.warnings ?? [];
          this.needsConfirm = false;
        } else {
          this.toast.error(body.message || body.error || 'Error al guardar');
        }
        this.cdr.detectChanges();
      },
    });
  }
}