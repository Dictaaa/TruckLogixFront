import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar }  from './navbar/navbar';
import { Sidebar} from './sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Navbar, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarOpen = true;
  pageTitle   = 'Portal Clientes';
}
