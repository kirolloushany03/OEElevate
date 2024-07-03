import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SlidingOverlayComponent } from '../../../shared/sliding-overlay/sliding-overlay.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'oee-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    SlidingOverlayComponent,
    ReactiveFormsModule
  ],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss'
})
export class EntryFormComponent {
  @Input({required: true}) formData: any = {}

  @ViewChild('slidingOverlay') slidingOverlay?: SlidingOverlayComponent;

  onSubmit(event: Event) {
    event.preventDefault();

    this.submitEmitter.emit(event);
  }

  open() {
    this.slidingOverlay?.slideIn();
  }

  close() {
    this.slidingOverlay?.slideOut();
    this.closeEmitter.emit();
  }

  @Output('submit') submitEmitter = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output('close') closeEmitter = new EventEmitter();
}
