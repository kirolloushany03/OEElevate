import { Component } from '@angular/core';
import { SideMenuComponent } from './side-menu/side-menu.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SideMenuComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
