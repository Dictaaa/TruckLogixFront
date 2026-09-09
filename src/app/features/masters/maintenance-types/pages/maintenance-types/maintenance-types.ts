import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';
import { DataTableComponent, TableColumn, TablePage } from '../../../../../core/components/data-table/data-table';
import { MatDialog } from '@angular/material/dialog';
import { MaintenanceTypeFormModal} from '../../modals/maintenance-type-form-modal/maintenance-type-form-modal';

@Component({
  selector: 'app-maintenance-types',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './maintenance-types.html',
  styleUrls: ['./maintenance-types.scss'],
})
export class MaintenanceTypes implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading = true;
  total   = 0;
  records: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: '', sortDir: 'asc'
  };

  columns: TableColumn[] = [
    { key: 'id',   label: 'ID',     sortable: true },
    { key: 'name', label: 'Nombre', sortable: true },
  ];

  get actions() {
    return [
      { label: 'Editar',   action: 'edit'   },
      { label: 'Eliminar', action: 'delete', danger: true },
    ];
  }

  ngOnInit(): void {}

  onPageChange(params: TablePage): void {
    this.lastParams = params;
    this.load(params);
  }

  load(params: TablePage): void {
    this.loading = true;
    let url = `${ENDPOINTS.MAINTENANCE_TYPES.LIST}?page=1&limit=200`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res.data ?? []);
        this.records = data.map((r: any) => ({ id: r.id, name: r.name }));
        this.total   = this.records.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  onAction(event: { action: string; row: any }): void {
    if (event.action === 'edit')   this.edit(event.row);
    if (event.action === 'delete') this.confirmDelete(event.row);
  }

  edit(row: any): void {
    const ref = this.dialog.open(MaintenanceTypeFormModal, {
      data: row,
      panelClass: 'dialog-panel',
      width: '420px',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(this.lastParams); });
  }

  openModal(): void {
    const ref = this.dialog.open(MaintenanceTypeFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '420px',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(this.lastParams); });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar "${row.name}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.MAINTENANCE_TYPES.DELETE(row.id)).subscribe({
      next: () => { this.toast.success('Eliminado'); this.load(this.lastParams); },
      error: () => this.toast.error('Error al eliminar'),
    });
  }
}