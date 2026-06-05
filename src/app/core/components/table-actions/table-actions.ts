import {
  Component, Input, Output, EventEmitter,
  HostListener, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableAction {
  label: string;
  icon?: string;   // SVG path string
  danger?: boolean;
  action: string;  // identificador que emite
}

@Component({
  selector: 'app-table-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ta-wrap">
      <button class="btn-dots" (click)="toggle($event)">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <circle cx="12" cy="5" r="1.5"/>
          <circle cx="12" cy="12" r="1.5"/>
          <circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
    </div>

    <!-- Portal fuera del flujo -->
    <div *ngIf="isOpen"
      class="dropdown-fixed"
      [style.top.px]="pos.top"
      [style.left.px]="pos.left">
      <button
        *ngFor="let a of actions"
        class="dropdown-item"
        [class.dropdown-item--danger]="a.danger"
        (click)="fire(a.action)">
        <svg *ngIf="a.icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" width="14" height="14">
          <path [attr.d]="a.icon"/>
        </svg>
        {{ a.label }}
      </button>
    </div>
  `,
})
export class TableActions {

  @Input() actions: TableAction[] = [
    {
      label: 'Editar',
      icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
      action: 'edit'
    },
    {
      label: 'Eliminar',
      icon: 'M3 6h18 M8 6V4h8v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6',
      danger: true,
      action: 'delete'
    }
  ];

  @Output() actionSelected = new EventEmitter<string>();

  isOpen = false;
  pos = { top: 0, left: 0 };

  constructor(private el: ElementRef) {}

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    if (this.isOpen) { this.isOpen = false; return; }

    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();

    this.pos = {
      top: rect.bottom + 4,
      left: rect.right - 150
    };

    this.isOpen = true;
  }

  fire(action: string): void {
    this.actionSelected.emit(action);
    this.isOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void { this.isOpen = false; }

  @HostListener('window:scroll')
  onScroll(): void { this.isOpen = false; }
}