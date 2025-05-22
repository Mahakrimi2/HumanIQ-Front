import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPayslipsComponent } from './my-payslips.component';

describe('MyPayslipsComponent', () => {
  let component: MyPayslipsComponent;
  let fixture: ComponentFixture<MyPayslipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyPayslipsComponent]
    });
    fixture = TestBed.createComponent(MyPayslipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
