import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { ClientFormModal } from '../../modals/client-form-modal/client-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class ClientsComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  clients: any[] = [];
  loading = true;

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.CLIENTS.LIST).subscribe({
      next: (data: any) => {
        this.clients = data;
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
    const ref = this.dialog.open(ClientFormModal, { data: null, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(ClientFormModal, { data: item, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.CLIENTS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Cliente eliminado');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}