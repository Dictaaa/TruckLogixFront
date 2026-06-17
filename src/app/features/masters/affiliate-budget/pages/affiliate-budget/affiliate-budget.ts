import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../../core/services/api/endpoints';
import { ToastService } from '../../../../../core/services/toast/toast';
import { AffiliateBudgetFormModal } from '../../modals/affiliate-budget-form-modal/affiliate-budget-form-modal';

const MONTH_NAMES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-affiliate-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affiliate-budget.html',
  styleUrl: './affiliate-budget.scss',
})
export class AffiliateBudgetComponent implements OnInit {

  private api    = inject(ApiService);
  private dialog = inject(MatDialog);
  private toast  = inject(ToastService);
  private cdr    = inject(ChangeDetectorRef);

  loading        = true;
  budgets:  any[] = [];
  affiliates: any[] = [];
  monthNames = MONTH_NAMES;
  months     = [1,2,3,4,5,6,7,8,9,10,11,12];

  currentMonth = new Date().getMonth() + 1;

  // Filtros
  selectedAffiliate = '';
  selectedYear      = new Date().getFullYear();
  yearOptions       = [2024, 2025, 2026];

  ngOnInit(): void {
    this.loadAffiliates();
    this.load();
  }

  loadAffiliates(): void {
    this.api.getAuth(ENDPOINTS.AFFILIATES.LIST).subscribe((d: any) => {
      this.affiliates = d;
      this.cdr.detectChanges();
    });
  }

  load(): void {
    this.loading = true;
    let url = `${ENDPOINTS.BUDGETS.LIST}?year=${this.selectedYear}`;
    if (this.selectedAffiliate) url += `&affiliate_id=${this.selectedAffiliate}`;

    this.api.getAuth(url).subscribe({
      next: (data: any) => {
        this.budgets = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; }
    });
  }

  // Obtiene el budget de un afiliado/mes específico
  getBudget(affiliateId: number, month: number): number {
    const b = this.budgets.find(b =>
      String(b.affiliate_id) === String(affiliateId) &&
      Number(b.month) === month &&
      Number(b.year) === this.selectedYear
    );
    return b ? Number(b.budget) : 0;
  }

  openModal(affiliate?: any): void {
    const ref = this.dialog.open(AffiliateBudgetFormModal, {
      data: {
        affiliate,
        year:      this.selectedYear,
        affiliates: this.affiliates,
        budgets:   this.budgets,
      },
      width:     '680px',
      maxHeight: '90vh',
      panelClass: 'dialog-panel',
    });

    ref.afterClosed().subscribe(result => {
      if (result?.saved) {
        this.toast.success('Presupuestos guardados');
        this.load();
      }
    });
  }

  totalByAffiliate(affiliateId: number): number {
    return this.budgets
      .filter(b => String(b.affiliate_id) === String(affiliateId) &&
                   Number(b.year) === this.selectedYear)
      .reduce((s, b) => s + Number(b.budget), 0);
  }
}