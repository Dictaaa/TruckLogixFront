import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';
import { DataTableComponent, TableColumn, TablePage } from '../../../../../core/components/data-table/data-table';
import { MatDialog } from '@angular/material/dialog';
import { TrailerPlateFormModal } from '../../modals/trailer-plate-form-modal/trailer-plate-form-modal';

@Component({
  selector: 'app-trailer-plates',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent],
  templateUrl: './trailer-plates.html',
  styleUrls: ['./trailer-plates.scss'],
})
export class TrailerPlates implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private cdr    = inject(ChangeDetectorRef);
  private toast  = inject(ToastService);

  loading = true;
  total   = 0;
  records: any[] = [];
  private rawRecords: any[] = [];

  private lastParams: TablePage = {
    page: 1, limit: 10, search: '', column: '', sortBy: '', sortDir: 'asc'
  };

  columns: TableColumn[] = [
    { key: 'plate',       label: 'Placa Trailer', sortable: true },
    { key: 'vehiclePlate',label: 'Cabezote',      sortable: true },
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
    let url = `${ENDPOINTS.TRAILER_PLATES.LIST}?limit=200`;
    if (params.search) url += `&search=${encodeURIComponent(params.search)}`;

    this.api.getAuth(url).subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res.data ?? []);
        this.rawRecords = data;
        this.records    = data.map((r: any) => ({
          id:           r.id,
          plate:        r.plate,
          vehiclePlate: r.vehicle?.plate || '—',
          vehicle_id:   r.vehicle_id,
        }));
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
    const raw = this.rawRecords.find(r => r.id === row.id);
    const ref = this.dialog.open(TrailerPlateFormModal, {
      data: raw,
      panelClass: 'dialog-panel',
      width: '480px',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(this.lastParams); });
  }

  openModal(): void {
    const ref = this.dialog.open(TrailerPlateFormModal, {
      data: null,
      panelClass: 'dialog-panel',
      width: '480px',
    });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.load(this.lastParams); });
  }

  confirmDelete(row: any): void {
    if (!confirm(`¿Eliminar trailer "${row.plate}"?`)) return;
    this.api.deleteAuth(ENDPOINTS.TRAILER_PLATES.DELETE(row.id)).subscribe({
      next: () => { this.toast.success('Eliminado'); this.load(this.lastParams); },
      error: () => this.toast.error('Error al eliminar'),
    });
  }
}