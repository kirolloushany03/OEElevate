import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SlidingOverlayComponent } from '../../../shared/sliding-overlay/sliding-overlay.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Machine } from '../../../models/machine';
import { DxDateBoxModule } from 'devextreme-angular';
import { Store } from '@ngxs/store';
import { AddOeeRecord } from '../../state/machines/machines.actions';

@Component({
  selector: 'oee-entry-form',
  standalone: true,
  imports: [
    CommonModule,
    SlidingOverlayComponent,
    ReactiveFormsModule,
    DxDateBoxModule
  ],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss'
})
export class EntryFormComponent {
  machine: Machine | null = null;

  entryForm: FormGroup = this.fb.group({
    run_time: [0, Validators.required],
    planned_production_time: [0, Validators.required],
    good_units: [0, Validators.required],
    total_units: [0, Validators.required],
    ideal_cycle_time: [0, Validators.required],
    date: [new Date().toISOString(), Validators.required],
  });

  editingMode = false;

  constructor(private fb: FormBuilder, private store: Store) {
  }

  @ViewChild('slidingOverlay') slidingOverlay?: SlidingOverlayComponent;

  onSubmit() {
    if (this.machine === null || this.entryForm.invalid) return;


    this.submitEmitter.emit(this.entryForm);
    if (!this.editingMode) {
      this.addOeeRecord();
    }
  }

  open(machine: Machine, data?: any) {
    this.slidingOverlay?.slideIn();
    this.machine = machine;
    this.editingMode = !!data;
    if (this.editingMode) {
      this.entryForm.patchValue(data);
    }
  }

  close() {
    this.slidingOverlay?.slideOut();
    // this.formData = {};
    this.closeEmitter.emit();
  }

  get run_time() {
    const val = this.entryForm.value.run_time;
    if (!val) return null;
    return val as number;
  }

  get planned_production_time() {
    const val = this.entryForm.value.planned_production_time;
    if (!val) return null;
    return val as number;
  }

  get good_units() {
    const val = this.entryForm.value.good_units;
    if (!val) return null;
    return val as number;
  }

  get total_units() {
    const val = this.entryForm.value.total_units;
    if (!val) return null;
    return val as number;
  }

  get ideal_cycle_time() {
    const val = this.entryForm.value.ideal_cycle_time;
    if (!val) return null;
    return val as number;
  }

  getAvailability() {
    if (this.planned_production_time)
      return (this.run_time ?? 0) / this.planned_production_time;
    return null;
  }

  getQuality() {
    if (this.total_units)
      return (this.good_units ?? 0) / this.total_units;
    return null;
  }

  getPerformance() {
    if (this.run_time)
      return (this.ideal_cycle_time ?? 0) * (this.total_units ?? 0) / this.run_time;
    return null;
  }

  getOEE() {
    const availability = this.getAvailability(),
      quality = this.getQuality(),
      performance = this.getPerformance();

    if (availability === null || quality === null || performance === null)
      return null;
    return availability * quality * performance;
  }

  getCalculations() {
    const dict = {
      availability: this.getAvailability(),
      quality: this.getQuality(),
      performance: this.getPerformance(),
      oee: this.getOEE()
    };

    return Object.entries(dict)
  }

  addOeeRecord() {
    if (this.machine === null) return;

    this.submitEmitter.emit(this.entryForm);
    this.store.dispatch(new AddOeeRecord(this.machine, {
      ...this.entryForm.value,
      date: new Date(this.entryForm.value.date).toISOString()
    })).subscribe(() => {
      this.close();
      this.closeEmitter.emit();
      this.entryForm.reset();
    });
  }

  @Output('submit') submitEmitter = new EventEmitter();
  @Output('close') closeEmitter = new EventEmitter();
}
