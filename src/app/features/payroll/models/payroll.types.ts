export interface PayrollSettings {
  company_id: number;
  min_wage: number;
  health_pension_discount_pct: number;
  holiday_sunday_bonus_pct: number;
  updated_at?: string;
}

export interface PayrollPreview {
  period: { year: number; month: number; fortnight: number; start: string; end: string };
  totalDaysInPeriod: number;
  daysWorked: number;
  noShowDays: number;
  minWage: number;
  proratedSalary: number;
  commission: number;
  healthPensionPct: number;
  healthPensionValue: number;
  loans: number;
  missedAppointmentsCount: number;
  missedAppointmentsValue: number;
  holidaySundayDays: number;
  holidaySundayBonusPct: number;
  holidaySundayBonusUnit: number;
  holidaySundayBonusTotal: number;
  totalPay: number;
}

export interface PayrollPeriodRow {
  id: number;
  company_id: number;
  year: number;
  month: number;
  fortnight: 1 | 2;
  start_date: string;
  end_date: string;
  status: 'abierto' | 'pagado';
  paid_at: string | null;
  paid_by: number | null;
}

export interface PayrollEntryRow {
  id: number;
  payroll_period_id: number;
  driver_id: number;
  driver?: { id: number; name: string };
  days_worked: number;
  min_wage: number;
  prorated_salary: number;
  commission: number;
  health_pension_pct: number;
  health_pension_value: number;
  loans: number;
  missed_appointments_value: number;
  holiday_sunday_days: number;
  holiday_sunday_bonus_pct: number;
  holiday_sunday_bonus_unit: number;
  holiday_sunday_bonus_total: number;
  total_pay: number;
  notes: string | null;
}