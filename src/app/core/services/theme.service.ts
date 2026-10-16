import { Injectable, effect, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

/**
 * Tema claro / oscuro.
 * - Se guarda en localStorage ('app-theme') y se mantiene entre sesiones.
 * - La primera vez usa la preferencia del sistema operativo.
 * - Aplica el atributo data-theme en <html>; styles.scss hace el resto.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly KEY = 'app-theme';

  /** Tema actual (signal: los componentes se actualizan solos al cambiar) */
  readonly theme = signal<AppTheme>(this.initialTheme());

  constructor() {
    effect(() => this.apply(this.theme()));
  }

  get isDark(): boolean {
    return this.theme() === 'dark';
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  set(theme: AppTheme): void {
    this.theme.set(theme);
  }

  private initialTheme(): AppTheme {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* localStorage no disponible */ }

    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private apply(theme: AppTheme): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    try { localStorage.setItem(this.KEY, theme); } catch { /* sin almacenamiento */ }
  }
}