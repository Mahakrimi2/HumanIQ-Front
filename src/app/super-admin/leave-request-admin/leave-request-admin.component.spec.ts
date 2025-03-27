import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestAdminComponent } from './leave-request-admin.component';

describe('LeaveRequestAdminComponent', () => {
  let component: LeaveRequestAdminComponent;
  let fixture: ComponentFixture<LeaveRequestAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaveRequestAdminComponent]
    });
    fixture = TestBed.createComponent(LeaveRequestAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
