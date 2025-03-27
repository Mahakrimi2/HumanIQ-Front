import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordRhComponent } from './dashbaord-rh.component';

describe('DashbaordRhComponent', () => {
  let component: DashbaordRhComponent;
  let fixture: ComponentFixture<DashbaordRhComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashbaordRhComponent]
    });
    fixture = TestBed.createComponent(DashbaordRhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
