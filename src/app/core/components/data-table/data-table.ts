import {
  Component, Input, Output, EventEmitter, OnInit,
  OnChanges, SimpleChanges, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableActions } from '../table-actions/table-actions';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface TableColumn {
  key:       string;
  label:     string;
  sortable?: boolean;
  format?:   'date' | 'currency' | 'badge' | 'placa' | 'text';
  badgeMap?: Record<string, { label: string; class: string }>;
}

export interface TableAction {
  label:   string;
  action:  string;
  danger?: boolean;
}

export interface TablePage {
  page:       number;
  limit:      number;
  search:     string;
  column:     string;
  sortBy:     string;
  sortDir:    'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableActions],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})

export class DataTableComponent implements OnInit, OnChanges {

  @Input() columns:    TableColumn[] = [];
  @Input() actions:    TableAction[] = [];
  @Input() data:       any[]         = [];
  @Input() total:      number        = 0;
  @Input() loading:    boolean       = false;
  @Input() exportName: string        = 'export';
  @Input() pageSize:   number        = 10;

  @Output() pageChange   = new EventEmitter<TablePage>();
  @Output() actionSelect = new EventEmitter<{ action: string; row: any }>();

  @Input()  showFilterBtn = false;
  @Output() filterClick   = new EventEmitter<void>();

  page        = 1;
  search      = '';
  searchCol   = '';   // '' = global
  sortBy      = '';
  sortDir: 'asc' | 'desc' = 'asc';
  searchTimer: any;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get pageSizes(): number[] { return [10, 50, 100, 500, 1000]; }

  ngOnInit(): void { this.emit(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pageSize']) this.emit();
  }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 1;
      this.emit();
    }, 400);
  }

  onSort(col: TableColumn): void {
    if (!col.sortable) return;
    if (this.sortBy === col.key) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy  = col.key;
      this.sortDir = 'asc';
    }
    this.emit();
  }

  changePage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.emit();
  }

  onPageSize(size: number): void {
    this.pageSize = size;
    this.page     = 1;
    this.emit();
  }

  emit(): void {
    this.pageChange.emit({
      page:    this.page,
      limit:   this.pageSize,
      search:  this.search,
      column:  this.searchCol,
      sortBy:  this.sortBy,
      sortDir: this.sortDir,
    });
  }

  getCellValue(row: any, col: TableColumn): any {
    return col.key.split('.').reduce((o, k) => o?.[k], row);
  }

  getSortIcon(key: string): string {
    if (this.sortBy !== key) return '↕';
    return this.sortDir === 'asc' ? '↑' : '↓';
  }

  // ── Exportación ───────────────────────────────────────────────────────
  exportExcel(): void {
    const rows = this.data.map(row =>
      Object.fromEntries(this.columns.map(c => [c.label, this.getCellValue(row, c) ?? '']))
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
    XLSX.writeFile(wb, `${this.exportName}.xlsx`);
  }

  exportPdf(): void {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(12);
    doc.text(this.exportName, 14, 15);
    autoTable(doc, {
      head:    [this.columns.map(c => c.label)],
      body:    this.data.map(row => this.columns.map(c => String(this.getCellValue(row, c) ?? ''))),
      startY:  22,
      styles:  { fontSize: 8 },
      headStyles: { fillColor: [26, 111, 219] },
    });
    doc.save(`${this.exportName}.pdf`);
  }
}