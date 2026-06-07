import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { YardFormModal } from '../../modals/yard-form-modal/yard-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-yards',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './yards.html',
  styleUrl: './yards.scss',
})
export class YardsComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  yards: any[] = [];
  loading = true;

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.get(ENDPOINTS.PATIOS.LIST).subscribe({
      next: (data: any) => {
        this.yards = data;
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
    const ref = this.dialog.open(YardFormModal, { data: null, width: '480px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(YardFormModal, { data: item, width: '480px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar patio "${item.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.PATIOS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Patio eliminado');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}