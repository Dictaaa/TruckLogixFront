import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loading = false;
  errorMsg = '';
  form!: FormGroup;

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
        // Pase lo que pase (éxito o error), el botón vuelve a su estado normal
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