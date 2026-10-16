import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

export type RevealType = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

/**
 * Hace aparecer un elemento cuando entra en pantalla al hacer scroll.
 *
 * Uso:
 *   <div appReveal>…</div>                       → sube y aparece
 *   <div appReveal="left" [revealDelay]="150">…  → entra desde la izquierda con retraso
 *
 * Los estilos (.reveal / .is-visible) están en home.scss.
 * Si quieres usarla en otras páginas, mueve ese bloque al styles.scss global.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {

  /** Tipo de entrada */
  @Input() appReveal: RevealType | '' = '';
  /** Retraso en milisegundos (para animar tarjetas en cascada) */
  @Input() revealDelay = 0;
  /** Repetir la animación cada vez que vuelve a entrar en pantalla */
  @Input() revealRepeat = false;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private doneTimer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const node: HTMLElement = this.el.nativeElement;
    node.classList.add('reveal', `reveal-${this.appReveal || 'up'}`);
    node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);

    const reduceMotion = typeof window !== 'undefined'
      && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Sin soporte o con "reducir movimiento": se muestra de una
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible', 'reveal-done');
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible');
          // Al terminar la entrada se marca "reveal-done": así los efectos hover
          // del elemento pueden usar su propia transición sin pisar la animación.
          clearTimeout(this.doneTimer);
          this.doneTimer = setTimeout(() => node.classList.add('reveal-done'), this.revealDelay + 750);
          if (!this.revealRepeat) this.observer?.unobserve(node);
        } else if (this.revealRepeat) {
          clearTimeout(this.doneTimer);
          node.classList.remove('is-visible', 'reveal-done');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    clearTimeout(this.doneTimer);
    this.observer?.disconnect();
  }
}