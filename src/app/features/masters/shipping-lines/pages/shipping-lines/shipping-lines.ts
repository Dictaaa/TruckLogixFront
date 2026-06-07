import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../../core/services/toast/toast';
import { ShippingLineFormModal } from '../../modals/shipping-line-form-modal/shipping-line-form-modal';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';

@Component({
  selector: 'app-shipping-lines',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './shipping-lines.html',
  styleUrl: './shipping-lines.scss',
})
export class ShippingLinesComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  shippingLines: any[] = [];
  loading = true;

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.SHIPPING_LINES.LIST).subscribe({
      next: (data: any) => {
        this.shippingLines = data;
        this.loading = false;
        setTimeout(() => this.cdr.detectChanges());
      },
      error: () => { this.loading = false; }
    });
  }

  onAction(action: string, item: any): void {
    if (action === 'edit')   this.edit(item);
    if (action === 'delete') this.confirmDelete(item);
  }

  openModal(): void {
    const ref = this.dialog.open(ShippingLineFormModal, { data: null, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(ShippingLineFormModal, { data: item, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.SHIPPING_LINES.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Línea eliminada');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}