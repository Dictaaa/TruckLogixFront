import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {

  user: any;

  constructor(private router: Router) {

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

  }

  logout() {

    localStorage.clear();

    this.router.navigate(['/login']);

  }

}