import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  @Input()  sidebarOpen = true;
  @Input()  pageTitle   = 'Portal Clientes';
  @Output() toggleSidebarEvent = new EventEmitter<void>();

  userName     = '';
  userRole     = '';
  userEmail    = '';
  userInitials = '';
  userMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const raw = localStorage.getItem('user');
    if (raw) {
      const user = JSON.parse(raw);
      this.userName     = `${user.first_name} ${user.last_name}`;
      this.userEmail    = user.email;
      this.userRole     = user.role === 1 ? 'Administrador' : 'Cliente';
      this.userInitials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
  }

  toggleSidebar() { this.toggleSidebarEvent.emit(); }

  toggleUserMenu() { this.userMenuOpen = !this.userMenuOpen; }

  logout() {
    this.userMenuOpen = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.closest('.nav-user')) this.userMenuOpen = false;
  }
}
