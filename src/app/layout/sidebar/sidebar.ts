import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NAV_GROUPS, NAV_TOP, NavGroup, NavLink } from '../../core/config/nav.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar implements OnInit, OnDestroy {
  /** Abierto (ancho completo) o contraído (solo íconos) */
  @Input() open = true;
  /** En celular el menú flota y se oculta del todo */
  @Input() mobile = false;
  /** Pide al layout que abra el menú (al tocar un grupo con el menú contraído) */
  @Output() requestOpen = new EventEmitter<void>();
  /** Se eligió una opción (en celular, el layout cierra el menú) */
  @Output() navigated = new EventEmitter<void>();

  private router = inject(Router);
  private auth   = inject(AuthService);
  private cdr    = inject(ChangeDetectorRef);
  private sub?: Subscription;

  topItems: NavLink[] = [];
  groups: NavGroup[] = [];
  openGroups = new Set<string>();
  currentUrl = '';

  /** Solo íconos (escritorio con el menú contraído) */
  get rail(): boolean {
    return !this.open && !this.mobile;
  }

  ngOnInit(): void {
    // Opciones que puede ver este usuario (los roles no cambian durante la sesión)
    this.topItems = NAV_TOP.filter(i => this.can(i.roles));
    this.groups = NAV_GROUPS
      .filter(g => this.can(g.roles))
      .map(g => ({ ...g, items: g.items.filter(i => this.can(i.roles)) }))
      .filter(g => g.items.length > 0);

    this.syncWithUrl(this.router.url);
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.syncWithUrl(e.urlAfterRedirects);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private can(roles?: number[]): boolean {
    return !roles || this.auth.hasRole(roles);
  }

  /** Abre automáticamente el grupo de la página actual */
  private syncWithUrl(url: string): void {
    this.currentUrl = url.split('?')[0];
    this.groups.forEach(g => {
      if (this.isGroupActive(g)) this.openGroups.add(g.id);
    });
  }

  isGroupActive(group: NavGroup): boolean {
    return group.items.some(i => this.currentUrl === i.route || this.currentUrl.startsWith(i.route + '/'));
  }

  isOpen(group: NavGroup): boolean {
    return !this.rail && this.openGroups.has(group.id);
  }

  toggleGroup(group: NavGroup): void {
    // Con el menú contraído, tocar un grupo abre el menú y despliega ese grupo
    if (this.rail) {
      this.openGroups.add(group.id);
      this.requestOpen.emit();
      return;
    }
    if (this.openGroups.has(group.id)) this.openGroups.delete(group.id);
    else this.openGroups.add(group.id);
  }

  onNavigate(): void {
    this.navigated.emit();
  }

  trackById(_: number, g: NavGroup) { return g.id; }
  trackByRoute(_: number, i: NavLink) { return i.route; }
}