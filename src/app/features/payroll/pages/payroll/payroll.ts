// payroll.component.ts
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../../core/services/api/api.service';
import { ENDPOINTS } from '../../../../core/services/api/endpoints';
import { ToastService } from '../../../../core/services/toast/toast';
import { PayrollFormModal, PayrollModalData } from '../../modals/payroll-form-modal/payroll-form-modal';
import { PayrollEntryRow, PayrollPeriodRow } from '../../models/payroll.types';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payroll.html',
  styleUrl: './payroll.scss',
})
export class Payroll implements OnInit {
  private api = inject(ApiService);
  private dialog = inject(MatDialog);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  drivers: any[] = [];

  // Quincena que se está viendo — por defecto, la que corresponde a hoy.
  year = new Date().getFullYear();
  month = new Date().getMonth() + 1;
  fortnight: 1 | 2 = new Date().getDate() <= 15 ? 1 : 2;

  period: PayrollPeriodRow | null = null;
  entries: PayrollEntryRow[] = [];
  loading = true;

  monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  get isPaid(): boolean { return this.period?.status === 'pagado'; }
  get totalPaid(): number { return this.entries.reduce((s, e) => s + Number(e.total_pay || 0), 0); }

  ngOnInit(): void {
    this.loadDrivers();
    this.loadPeriod();
  }

  private loadDrivers(): void {
    this.api.getAuth(ENDPOINTS.DRIVERS.LIST).subscribe((d: any) => {
      this.drivers = d;
      this.cdr.detectChanges();
    });
  }

  /** Busca si ya existe un período guardado para esta quincena (y sus nóminas, si las hay). Si no existe todavía, no es un error — solo significa que nadie ha generado ninguna nómina acá. */
  loadPeriod(): void {
    this.loading = true;
    this.api.getAuth(`${ENDPOINTS.PAYROLL.PERIODS}?year=${this.year}`).subscribe({
      next: (periods: PayrollPeriodRow[]) => {
        const found = periods.find(p => p.month === this.month && p.fortnight === this.fortnight);
        if (found) {
          this.period = found;
          this.loadEntries(found.id);
        } else {
          this.period = null;
          this.entries = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  private loadEntries(periodId: number): void {
    this.api.getAuth(ENDPOINTS.PAYROLL.PERIOD_ENTRIES(periodId)).subscribe({
      next: (res: { period: PayrollPeriodRow; entries: PayrollEntryRow[] }) => {
        this.period = res.period;
        this.entries = res.entries;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  changeFortnight(f: 1 | 2): void {
    this.fortnight = f;
    this.loadPeriod();
  }

  changeMonth(delta: number): void {
    this.month += delta;
    if (this.month > 12) { this.month = 1; this.year++; }
    if (this.month < 1) { this.month = 12; this.year--; }
    this.loadPeriod();
  }

  entryForDriver(driverId: number): PayrollEntryRow | undefined {
    return this.entries.find(e => e.driver_id === driverId);
  }

  formatMoney(v: number): string {
    return '$ ' + Number(v || 0).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  openDriverPayroll(driver: any): void {
    const data: PayrollModalData = {
      driverId: driver.id,
      driverName: driver.name,
      year: this.year,
      month: this.month,
      fortnight: this.fortnight,
      readOnly: this.isPaid,
    };
    const ref = this.dialog.open(PayrollFormModal, { data, width: '640px', maxHeight: '90vh' });
    ref.afterClosed().subscribe(r => { if (r?.saved) this.loadPeriod(); });
  }

  confirmPayment(): void {
    if (!this.entries.length) {
      this.toast.error('Primero genera la nómina de al menos un conductor.');
      return;
    }
    if (!confirm(`¿Confirmar el pago de ${this.entries.length} conductor(es) por un total de ${this.formatMoney(this.totalPaid)}? Esto no se puede deshacer.`)) return;

    // El período se crea solo (findOrCreate) al guardar la primera
    // nómina — a este punto ya existe siempre que this.entries.length > 0.
    this.api.postAuth(ENDPOINTS.PAYROLL.PERIOD_PAY(this.period!.id), {}).subscribe({
      next: () => {
        this.toast.success('Nómina pagada');
        this.loadPeriod();
      },
      error: (err) => this.toast.error(err?.error?.message || 'No se pudo confirmar el pago'),
    });
  }
}