import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'oee-sliding-overlay',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './sliding-overlay.component.html',
  styleUrl: './sliding-overlay.component.scss'
})
export class SlidingOverlayComponent {
  @Output() close = new EventEmitter<void>();

  show = false;

  slideIn() {
    this.show = true;
  }

  slideOut() {
    this.show = false;
    this.close.emit();
  }
}
