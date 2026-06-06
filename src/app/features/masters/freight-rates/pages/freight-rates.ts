import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { TableActions } from '../../../../core/components/table-actions/table-actions';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { FreightRatesFormModal } from '../modals/freight-rates-form-modal/freight-rates-form-modal';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-freight-rates',
  standalone: true,
  imports: [CommonModule, TableActions],
  templateUrl: './freight-rates.html',
  styleUrl: './freight-rates.scss',
})
export class FreightRates implements OnInit {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);
  private dialog = inject(MatDialog);

  // Inicializa con observables vacíos para que el template nunca reciba null
filteredCompanies$: Observable<any[]> = new Observable(s => s.next([]));
filteredOrigen$:    Observable<any[]> = new Observable(s => s.next([]));
filteredDestino$:   Observable<any[]> = new Observable(s => s.next([]));

  freights: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.FREIGHTS.LIST).subscribe({
      next: (data: any) => {
        this.freights = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  actions = [
    { label: 'Editar', action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  onAction(action: string, item: any): void {
    if (action === 'edit') this.edit(item);
    if (action === 'delete') this.confirmDelete(item);
  }

  edit(item: any): void {
  const ref = this.dialog.open(FreightRatesFormModal, {
    data: item,
    width: '700px',  // ajusta según tu modal
  });
  ref.afterClosed().subscribe(r => { if (r?.saved) this.load(); });
}

openModal(): void {
  const ref = this.dialog.open(FreightRatesFormModal, {
    data: null,
    width: '700px',
  });
  ref.afterClosed().subscribe(r => { if (r?.saved) this.load(); });
}

  confirmDelete(item: any): void {
    if (!confirm(`¿Eliminar la tarifa #${item.id}?`)) return;
    this.api.deleteAuth(ENDPOINTS.FREIGHTS.DELETE(item.id)).subscribe({
      next: () => this.load(),
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}