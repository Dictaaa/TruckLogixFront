import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';

const ACTION_LABELS: Record<string, string> = {
  temp_order:            'OC temporal asignada',
  purchase_order:        'Orden de compra asignada',
  invoice:               'Factura asignada',
  revert_invoice:        'Factura revertida',
  revert_purchase_order: 'Orden de compra revertida',
  revert_temp_order:     'OC temporal revertida',
};

@Component({
  selector: 'app-billing-history-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './billing-history-modal.html',
  styleUrl: './billing-history-modal.scss',
})
export class BillingHistoryModal implements OnInit {

  private dialogRef = inject(MatDialogRef<BillingHistoryModal>);
  private api       = inject(ApiService);
  private cdr       = inject(ChangeDetectorRef);
  data              = inject(MAT_DIALOG_DATA);

  events: any[] = [];
  loading = true;

  get trip(): any { return this.data.trip; }

  ngOnInit(): void {
    this.api.getAuth(ENDPOINTS.BILLING.HISTORY(this.trip.id)).subscribe({
      next: (res: any) => {
        this.events = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  actionLabel(a: string): string { return ACTION_LABELS[a] ?? a; }
  isRevert(a: string): boolean { return a?.startsWith('revert_'); }

  close(): void { this.dialogRef.close(); }
}