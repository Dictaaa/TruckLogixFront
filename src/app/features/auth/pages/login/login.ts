import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../../core/components/theme-toggle/theme-toggle';
import { BRAND } from '../../../../core/config/brand.config';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ThemeToggleComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loading = false;
  errorMsg = '';
  showPassword = false;
  year = new Date().getFullYear();
  form!: FormGroup;
  brand = BRAND;

  private title  = inject(Title);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Al volver a escribir, se quita el mensaje de error
    this.form.valueChanges.subscribe(() => {
      if (this.errorMsg) {
        this.errorMsg = '';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.title.setTitle(`${this.brand.name} · ${this.brand.tagline}`);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Ingresa un correo válido y tu contraseña.';
      this.cdr.detectChanges();
      return;
    }
    if (this.loading) return;

    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    const { email, password } = this.form.getRawValue();

    this.authService.login(email!, password!)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.authService.saveSession(res.token, res.user);

          if (res.user.role === 4) {
            this.router.navigate(['/fuel-logs']);
          } else {
            this.router.navigate(['/transport-movements']);
          }
        },
        error: (err) => {
          this.errorMsg = err?.status === 0
            ? 'No hay conexión con el servidor. Intenta de nuevo.'
            : (err?.error?.error || 'Credenciales inválidas');
          this.cdr.detectChanges();
        }
      });
  }
}