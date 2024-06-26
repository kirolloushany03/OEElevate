import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  items = [
    {
      title: 'Dashboard',
      icon: 'fa-chart-line',
      link: '/dashboard'
    },
    {
    title: 'Machines',
      icon: 'fa-grip',
      link: '/machines'
    },
    {
      title: 'Profile',
      icon: 'fa-user',
      link: '/profile'
    },
    {
      title: 'Settings',
      icon: 'fa-gear',
      link: '/settings'
    },
    {
      title: 'Logout',
      icon: 'fa-sign-out-alt',
      link: '/logout'
    }
  ]
}
