import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { DriverFormModal } from '../../modals/driver-form-modal/driver-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class DriversComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  drivers: any[] = [];
  loading = true;

  licenseCategories: Record<number, string> = {
    1: 'A1', 2: 'A2', 3: 'B1', 4: 'B2',
    5: 'B3', 6: 'C1', 7: 'C2', 8: 'C3'
  };

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe({
      next: (data: any) => {
        this.drivers = data;
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
    const ref = this.dialog.open(DriverFormModal, { data: null, width: '640px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(DriverFormModal, { data: item, width: '640px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  isExpiringSoon(date: string): boolean {
    if (!date) return false;
    const exp  = new Date(date);
    const diff = (exp.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }

  isExpired(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.DRIVERS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Conductor eliminado');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}