import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestManagerComponent } from './leave-request-manager.component';

describe('LeaveRequestManagerComponent', () => {
  let component: LeaveRequestManagerComponent;
  let fixture: ComponentFixture<LeaveRequestManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestManagerComponent]
    });
    fixture = TestBed.createComponent(LeaveRequestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
