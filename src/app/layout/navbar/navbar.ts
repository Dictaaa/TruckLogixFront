import { Component, EventEmitter, HostListener, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BRAND } from '../../core/config/brand.config';
import { ROLE_LABELS } from '../../core/config/nav.config';
import { AuthService } from '../../core/services/auth.service';
import { ThemeToggleComponent } from '../../core/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar implements OnInit {
  @Input()  sidebarOpen = true;
  @Input()  pageTitle   = '';
  @Input()  pageSection = '';
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  private router = inject(Router);
  private auth   = inject(AuthService);

  brand = BRAND;

  userName     = '';
  userRole     = '';
  userEmail    = '';
  userInitials = '';
  userMenuOpen = false;

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const user = JSON.parse(raw);
      const first = String(user.first_name ?? '').trim();
      const last  = String(user.last_name ?? '').trim();
      this.userName     = `${first} ${last}`.trim() || user.email || 'Usuario';
      this.userEmail    = user.email ?? '';
      this.userRole     = ROLE_LABELS[Number(user.role)] ?? 'Usuario';
      this.userInitials = ((first[0] ?? '') + (last[0] ?? '')).toUpperCase() || 'U';
    } catch { /* sesión corrupta: se muestra sin datos */ }
  }

  toggleSidebar(): void { this.toggleSidebarEvent.emit(); }

  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.userMenuOpen = false;
    const auth: any = this.auth;
    if (typeof auth.logout === 'function') {
      auth.logout();
    } else {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch { }
    }
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-user')) this.userMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.userMenuOpen = false;
  }
}