import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription, filter } from 'rxjs';
import { Navbar } from './navbar/navbar';
import { Sidebar } from './sidebar/sidebar';
import { BRAND } from '../core/config/brand.config';
import { findNavByUrl } from '../core/config/nav.config';

const MOBILE_BREAKPOINT = 900;
const SIDEBAR_KEY = 'sidebar-open';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit, OnDestroy {

  private router = inject(Router);
  private title  = inject(Title);
  private cdr    = inject(ChangeDetectorRef);
  private sub?: Subscription;

  isMobile    = false;
  sidebarOpen = true;
  pageTitle   = '';
  pageSection = '';

  ngOnInit(): void {
    this.isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    this.sidebarOpen = this.isMobile ? false : this.loadSidebarState();
    this.updateTitle(this.router.url);

    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.updateTitle(e.urlAfterRedirects);
        if (this.isMobile) this.sidebarOpen = false;   // en celular se cierra al navegar
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (mobile === this.isMobile) return;
    this.isMobile = mobile;
    this.sidebarOpen = mobile ? false : this.loadSidebarState();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMobile && this.sidebarOpen) this.sidebarOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.saveSidebarState();
  }

  openSidebar(): void {
    this.sidebarOpen = true;
    this.saveSidebarState();
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  private updateTitle(url: string): void {
    const hit = findNavByUrl(url);
    this.pageTitle   = hit?.item.label ?? BRAND.tagline;
    this.pageSection = hit?.group && hit.group.items.length > 1 ? hit.group.label : '';
    this.title.setTitle(`${this.pageTitle} · ${BRAND.name}`);
  }

  // El estado abierto/cerrado se recuerda solo en escritorio
  private loadSidebarState(): boolean {
    try { return localStorage.getItem(SIDEBAR_KEY) !== '0'; } catch { return true; }
  }

  private saveSidebarState(): void {
    if (this.isMobile) return;
    try { localStorage.setItem(SIDEBAR_KEY, this.sidebarOpen ? '1' : '0'); } catch { }
  }
}