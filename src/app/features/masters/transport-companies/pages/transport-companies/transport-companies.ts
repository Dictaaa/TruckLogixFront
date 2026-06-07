import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { TransportCompanieFormModal } from '../../modals/transport-companie-form-modal/transport-companie-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-transport-companies',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './transport-companies.html',
  styleUrl: './transport-companies.scss',
})
export class TransportCompaniesComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  companies: any[] = [];
  loading = true;

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.TRANSPORT_COMPANIES.LIST).subscribe({
      next: (data: any) => {
        this.companies = data;
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
    const ref = this.dialog.open(TransportCompanieFormModal, { data: null, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(TransportCompanieFormModal, { data: item, width: '560px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.TRANSPORT_COMPANIES.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Empresa eliminada');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}