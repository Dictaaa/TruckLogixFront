import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {

  @Input('appHasRole') roles: number[] = [];

  private templateRef    = inject(TemplateRef<any>);
  private viewContainer  = inject(ViewContainerRef);
  private authService    = inject(AuthService);

  ngOnInit(): void {
    if (this.authService.hasRole(this.roles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}