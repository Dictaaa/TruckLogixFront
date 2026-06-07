import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { UserFormModal } from '../../modals/user-form-modal/user-form-modal';
import { ToastService } from '../../../../../core/services/toast/toast';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  users: any[] = [];
  loading = true;

  profiles: Record<number, string> = {
    1: 'Administrador',
    2: 'Auxiliar',
    3: 'Afiliado',
  };

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.USERS.LIST).subscribe({
      next: (data: any) => {
        this.users = data;
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
    const ref = this.dialog.open(UserFormModal, { data: null, width: '680px', maxHeight: '90vh' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(UserFormModal, { data: item, width: '680px' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar usuario "${item.first_name} ${item.last_name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.USERS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Usuario eliminado');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}