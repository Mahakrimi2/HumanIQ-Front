import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipListComponent } from './payslip-list.component';

describe('PayslipListComponent', () => {
  let component: PayslipListComponent;
  let fixture: ComponentFixture<PayslipListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayslipListComponent]
    });
    fixture = TestBed.createComponent(PayslipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
