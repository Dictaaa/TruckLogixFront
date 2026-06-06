import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast/toast';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './toast.scss',
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts" class="toast toast--{{ t.type }}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <circle *ngIf="t.type === 'error' || t.type === 'success'" cx="12" cy="12" r="10"/>
          <path *ngIf="t.type === 'error'"   d="M15 9l-6 6M9 9l6 6"/>
          <path *ngIf="t.type === 'success'" d="M9 12l2 2 4-4"/>
          <polygon *ngIf="t.type === 'warning'" points="12,5 4,19 20,19" fill="none" stroke="currentColor" stroke-width="2"/>
          <path *ngIf="t.type === 'warning'" d="M12 9v4M12 17h.01"/>
        </svg>
        {{ t.message }}
      </div>
    </div>
  `,
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService      = inject(ToastService);
  private cdr               = inject(ChangeDetectorRef);
  private overlayContainer  = inject(OverlayContainer);
  private sub!: Subscription;

  toasts: Toast[] = [];

  ngOnInit(): void {
    // Inserta el host dentro del overlay container del CDK
    const container = this.overlayContainer.getContainerElement();
    const host = document.querySelector('app-toast');
    if (host) container.appendChild(host);

    this.sub = this.toastService.toast$.subscribe(toast => {
      this.toasts = [...this.toasts, toast];
      this.cdr.detectChanges();

      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t !== toast);
        this.cdr.detectChanges();
      }, 3500);
    });
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}