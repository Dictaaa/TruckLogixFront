import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { TableActions } from '../../../../../core/components/table-actions/table-actions';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../../core/services/toast/toast';
import {
  PygParameterFormModal, PygField, PYG_MONTHLY_FIELDS, PYG_ANNUAL_FIELDS,
} from '../../modals/pyg-parameter-form-modal/pyg-parameter-form-modal';

@Component({
  selector: 'app-pyg-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule, TableActions],
  templateUrl: './pyg-parameters.html',
  styleUrl: './pyg-parameters.scss',
})
export class PygParametersComponent implements OnInit {

  private api    = inject(ApiService);
  private cdr    = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);

  rows: any[] = [];
  loading = true;

  // Filtro: '' = todas, 'general' = solo generales, <id> = una placa
  scopeFilter: string = '';

  fields: PygField[] = [...PYG_MONTHLY_FIELDS, ...PYG_ANNUAL_FIELDS];

  // Valores que aplican hoy (resumen de arriba)
  current: Record<string, number> = {};

  /** ids de las versiones que están vigentes hoy (la más reciente <= hoy por alcance) */
  private vigentes = new Set<number>();

  actions = [
    { label: 'Editar',   action: 'edit' },
    { label: 'Eliminar', action: 'delete', danger: true }
  ];

  private get today(): string {
    return new Date(Date.now() - 5 * 3600000).toISOString().substring(0, 10);
  }

  get plates(): { id: number; plate: string }[] {
    const map = new Map<number, string>();
    this.rows.forEach(r => { if (r.vehicle_id) map.set(r.vehicle_id, r.vehicle?.plate ?? `#${r.vehicle_id}`); });
    return [...map.entries()].map(([id, plate]) => ({ id, plate })).sort((a, b) => a.plate.localeCompare(b.plate));
  }

  get filteredRows(): any[] {
    if (!this.scopeFilter) return this.rows;
    if (this.scopeFilter === 'general') return this.rows.filter(r => !r.vehicle_id);
    return this.rows.filter(r => String(r.vehicle_id) === this.scopeFilter);
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAuth(ENDPOINTS.PYG_PARAMETERS.LIST).subscribe({
      next: (data: any) => {
        this.rows = data ?? [];
        this.markVigentes();
        this.loading = false;
        setTimeout(() => this.cdr.detectChanges());
      },
      error: () => { this.loading = false; }
    });

    this.api.getAuth(`${ENDPOINTS.PYG_PARAMETERS.RESOLVED}?date=${this.today}`).subscribe({
      next: (r: any) => {
        this.current = r?.values ?? {};
        setTimeout(() => this.cdr.detectChanges());
      },
    });
  }

  private markVigentes(): void {
    this.vigentes.clear();
    const seen = new Set<string>();
    // rows vienen ordenadas por valid_from DESC
    this.rows.forEach(r => {
      const key = r.vehicle_id ? `v${r.vehicle_id}` : 'general';
      if (!seen.has(key) && r.valid_from <= this.today) {
        this.vigentes.add(r.id);
        seen.add(key);
      }
    });
  }

  status(r: any): 'vigente' | 'futura' | 'anterior' {
    if (r.valid_from > this.today) return 'futura';
    return this.vigentes.has(r.id) ? 'vigente' : 'anterior';
  }

  isSet(v: any): boolean {
    return v !== null && v !== undefined && v !== '';
  }

  fmt(v: any, kind: PygField['kind']): string {
    if (!this.isSet(v)) return '';
    const n = Number(v);
    if (kind === 'pct') return `${n}%`;
    if (kind === 'int') return String(n);
    return '$ ' + n.toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  onAction(action: string, item: any): void {
    if (action === 'edit')   this.edit(item);
    if (action === 'delete') this.confirmDelete(item);
  }

  openModal(): void {
    const ref = this.dialog.open(PygParameterFormModal, { data: null, width: '760px', maxHeight: '90vh' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  edit(item: any): void {
    const ref = this.dialog.open(PygParameterFormModal, { data: item, width: '760px', maxHeight: '90vh' });
    ref.afterClosed().subscribe(r => { if (r?.saved) setTimeout(() => this.load()); });
  }

  confirmDelete(item: any): void {
    const scope = item.vehicle_id ? `de la placa ${item.vehicle?.plate}` : 'general';
    if (!confirm(`¿Eliminar la versión ${scope} vigente desde ${item.valid_from}?\nLos meses afectados volverán a usar la versión anterior.`)) return;
    this.api.deleteAuth(ENDPOINTS.PYG_PARAMETERS.DELETE(item.id)).subscribe({
      next: () => {
        this.toast.success('Versión eliminada');
        setTimeout(() => this.load());
      },
      error: () => this.toast.error('Error al eliminar')
    });
  }
}