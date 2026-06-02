import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],

  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loading = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  async login() {

  if (this.form.invalid) return;

  this.loading = true;

  const { email, password } = this.form.getRawValue();

  this.authService.login(email!, password!)
    .subscribe({
      next: (res: any) => {

        this.loading = false;

        // guardar sesión
        this.authService.saveSession(
          res.token,
          res.user
        );
        

        this.router.navigate(['/transport']);
        //alert('Login correcto');

      },

      error: (err) => {

        this.loading = false;

        alert(err.error.error || 'Error login');

      }
    });

}
}