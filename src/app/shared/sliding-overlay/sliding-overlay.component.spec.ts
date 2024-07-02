import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingOverlayComponent } from './sliding-overlay.component';

describe('SlidingOverlayComponent', () => {
  let component: SlidingOverlayComponent;
  let fixture: ComponentFixture<SlidingOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlidingOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
