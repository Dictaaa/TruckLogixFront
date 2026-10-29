// payroll-modal.component.ts
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { PayrollPreview } from '../../models/payroll.types';

export interface PayrollModalData {
  driverId: number;
  driverName: string;
  year: number;
  month: number;
  fortnight: 1 | 2;
  readOnly: boolean;
}

@Component({
  selector: 'app-payroll-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './payroll-form-modal.html',
  styleUrl: './payroll-form-modal.scss',
})
export class PayrollFormModal implements OnInit {
  private dialogRef = inject(MatDialogRef<PayrollFormModal>);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);
  data: PayrollModalData = inject(MAT_DIALOG_DATA);

  loading = true;
  saving = false;
  preview: PayrollPreview | null = null;

  form = {
    min_wage: 0,
    commission: 0,
    health_pension_value: 0,
    loans: 0,
    missed_appointments_value: 0,
    holiday_sunday_bonus_pct: 0,
    notes: '',
  };

  ngOnInit(): void {
    this.loadPreview();
  }

  private loadPreview(): void {
    this.loading = true;
    const url = `${ENDPOINTS.PAYROLL.PREVIEW}?driver_id=${this.data.driverId}&year=${this.data.year}&month=${this.data.month}&fortnight=${this.data.fortnight}`;
    this.api.getAuth(url).subscribe({
      next: (res: PayrollPreview) => {
        this.preview = res;
        this.form.min_wage = res.minWage;
        this.form.commission = res.commission;
        this.form.health_pension_value = res.healthPensionValue;
        this.form.loans = 0;
        this.form.missed_appointments_value = res.missedAppointmentsValue;
        this.form.holiday_sunday_bonus_pct = res.holidaySundayBonusPct;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('No se pudo calcular la nómina de este conductor');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get totalDaysInPeriod(): number { return this.preview?.totalDaysInPeriod ?? 0; }
  get daysWorked(): number { return this.preview?.daysWorked ?? 0; }
  get dailyRate(): number { return this.form.min_wage / 30; }
  get proratedSalary(): number {
    const periodBaseSalary = this.form.min_wage / 2;
    const noShowDays = this.preview?.noShowDays ?? 0;
    return periodBaseSalary - (noShowDays * this.dailyRate);
  }
  get holidaySundayDays(): number { return this.preview?.holidaySundayDays ?? 0; }
  get holidayBonusUnit(): number { return this.dailyRate * (this.form.holiday_sunday_bonus_pct / 100); }
  get holidayBonusTotal(): number { return this.holidaySundayDays * this.holidayBonusUnit; }

  get totalPay(): number {
    return this.proratedSalary + this.form.commission + this.holidayBonusTotal
      - this.form.health_pension_value - this.form.loans - this.form.missed_appointments_value;
  }

  formatMoney(v: number): string {
    return '$ ' + Math.round(v || 0).toLocaleString('es-CO');
  }

  save(): void {
    if (this.saving || !this.preview) return;
    this.saving = true;

    const payload = {
      driver_id: this.data.driverId,
      year: this.data.year,
      month: this.data.month,
      fortnight: this.data.fortnight,
      days_worked: this.daysWorked,
      min_wage: this.form.min_wage,
      prorated_salary: round2(this.proratedSalary),
      commission: this.form.commission,
      health_pension_value: round2(this.form.health_pension_value),
      loans: this.form.loans,
      missed_appointments_value: this.form.missed_appointments_value,
      holiday_sunday_days: this.holidaySundayDays,
      holiday_sunday_bonus_pct: this.form.holiday_sunday_bonus_pct,
      holiday_sunday_bonus_unit: round2(this.holidayBonusUnit),
      holiday_sunday_bonus_total: round2(this.holidayBonusTotal),
      total_pay: round2(this.totalPay),
      notes: this.form.notes || null,
    };

    this.api.postAuth(ENDPOINTS.PAYROLL.ENTRIES, payload).subscribe({
      next: () => {
        this.saving = false;
        this.cdr.detectChanges();
        this.toast.success('Nómina guardada');
        this.dialogRef.close({ saved: true });
      },
      error: (err) => {
        this.saving = false;
        this.cdr.detectChanges();
        this.toast.error(err?.error?.message || 'No se pudo guardar la nómina');
      },
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}