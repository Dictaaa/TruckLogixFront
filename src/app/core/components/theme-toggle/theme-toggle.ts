import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

/**
 * Botón para cambiar entre modo claro y oscuro.
 * Uso: <app-theme-toggle></app-theme-toggle>
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button type="button" class="theme-toggle" (click)="theme.toggle()"
      [attr.aria-label]="theme.isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      [title]="theme.isDark ? 'Modo claro' : 'Modo oscuro'">

      @if (theme.isDark) {
        <!-- Sol -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      } @else {
        <!-- Luna -->
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      }
    </button>
  `,
  styles: [`
    :host { display: inline-flex; }

    .theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      padding: 0;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-muted);
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s;
    }

    .theme-toggle svg { width: 18px; height: 18px; }

    .theme-toggle:hover {
      color: var(--primary-text);
      border-color: var(--primary);
      background: var(--primary-soft);
    }

    .theme-toggle:active { transform: scale(0.94); }
  `],
})
export class ThemeToggleComponent {
  theme = inject(ThemeService);
}