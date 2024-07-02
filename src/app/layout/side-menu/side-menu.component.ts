import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from '../../auth/state/auth.actions';

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
  constructor(private store: Store) { }

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
    }
  ]

  logout() {
    this.store.dispatch(new Logout());
  }
}
