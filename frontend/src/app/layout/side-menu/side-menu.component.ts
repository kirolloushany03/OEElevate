import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from '../../auth/state/auth.actions';

@Component({
  selector: 'oee-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  constructor(private store: Store, private router: Router) { }

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
    this.store.dispatch(new Logout()).subscribe(() => {
      console.log("Logged out, redirecting to login page")
      this.router.navigate(['/login'])
    });
  }
}
