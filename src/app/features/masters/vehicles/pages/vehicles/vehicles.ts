import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { VehicleFormModal } from '../../modals/vehicle-form-modal/vehicle-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './vehicles.html',
  styleUrl: './vehicles.scss',
})
export class VehiclesComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  vehicles: any[] = [];
  loading = true;

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.VEHICLES.LIST).subscribe({
      next: (data: any) => {
        this.vehicles = data;
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
    const ref = this.dialog.open(VehicleFormModal, { data: null, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(VehicleFormModal, { data: item, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  isExpiringSoon(date: string): boolean {
    if (!date) return false;
    const diff = (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 30 && diff >= 0;
  }

  isExpired(date: string): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar vehículo "${item.plate}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.VEHICLES.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Vehículo eliminado');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}