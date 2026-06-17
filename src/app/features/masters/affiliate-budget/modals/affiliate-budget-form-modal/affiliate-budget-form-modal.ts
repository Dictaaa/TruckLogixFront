import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';

const MONTH_NAMES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-affiliate-budget-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatAutocompleteModule, ReactiveFormsModule],
  templateUrl: './affiliate-budget-form-modal.html',
  styleUrl: './affiliate-budget-form-modal.scss',
})
export class AffiliateBudgetFormModal implements OnInit {

  private dialogRef = inject(MatDialogRef<AffiliateBudgetFormModal>);
  private api       = inject(ApiService);
  private toast     = inject(ToastService);
  data              = inject(MAT_DIALOG_DATA);

  saving     = false;
  monthNames = MONTH_NAMES;
  months     = [1,2,3,4,5,6,7,8,9,10,11,12];

  // Autocomplete afiliado
  affiliates:       any[] = [];
  afiliadoCtrl      = new FormControl('');
  filteredAffiliates$!: Observable<any[]>;
  selectedAffiliateId: any = null;

  // Presupuestos por mes
  budgetForm: Record<number, number> = {};

  ngOnInit(): void {
    this.affiliates = this.data.affiliates ?? [];

    // Inicializa los 12 meses en 0
    this.months.forEach(m => this.budgetForm[m] = 0);

    // Si viene un afiliado preseleccionado
    if (this.data.affiliate) {
      this.selectedAffiliateId = this.data.affiliate.id;
      this.afiliadoCtrl.setValue(this.data.affiliate, { emitEvent: false });
      this.preloadBudgets();
    }

    // Autocomplete
    this.filteredAffiliates$ = this.afiliadoCtrl.valueChanges.pipe(
      startWith(''),
      map(v => {
        const q = (v ?? '').toString().toLowerCase();
        return q
          ? this.affiliates.filter(a => a.name?.toLowerCase().includes(q))
          : this.affiliates.slice();
      })
    );
  }

  private preloadBudgets(): void {
    const existingBudgets = this.data.budgets ?? [];
    existingBudgets
      .filter((b: any) =>
        String(b.affiliate_id) === String(this.selectedAffiliateId) &&
        Number(b.year) === this.data.year
      )
      .forEach((b: any) => {
        this.budgetForm[Number(b.month)] = Number(b.budget);
      });
  }

  displayFn(item: any): string { return item ? (item.name ?? '') : ''; }

  onSelectAffiliate(item: any): void {
    this.selectedAffiliateId = item.id;
    // Precarga budgets existentes para este afiliado
    this.months.forEach(m => this.budgetForm[m] = 0);
    const existingBudgets = this.data.budgets ?? [];
    existingBudgets
      .filter((b: any) =>
        String(b.affiliate_id) === String(item.id) &&
        Number(b.year) === this.data.year
      )
      .forEach((b: any) => {
        this.budgetForm[Number(b.month)] = Number(b.budget);
      });
  }

  totalPresupuesto(): number {
    return Object.values(this.budgetForm).reduce((s, v) => s + (v || 0), 0);
  }

  close(): void { this.dialogRef.close(); }

  save(): void {
    if (this.saving) return;

    if (!this.selectedAffiliateId) {
      this.toast.error('Selecciona un afiliado');
      return;
    }

    this.saving = true;

    const budgets = this.months.map(m => ({
      month:  m,
      budget: Number(this.budgetForm[m] || 0),
    }));

    this.api.postAuth(ENDPOINTS.BUDGETS.UPSERT_MANY, {
      affiliate_id: this.selectedAffiliateId,
      year:         this.data.year,
      budgets,
    }).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close({ saved: true });
      },
      error: (err) => {
        this.saving = false;
        this.toast.error(err.error?.error || 'Error al guardar');
      }
    });
  }
}