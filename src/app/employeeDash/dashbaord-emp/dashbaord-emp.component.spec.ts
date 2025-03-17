import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbaordEmpComponent } from './dashbaord-emp.component';

describe('DashbaordEmpComponent', () => {
  let component: DashbaordEmpComponent;
  let fixture: ComponentFixture<DashbaordEmpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashbaordEmpComponent]
    });
    fixture = TestBed.createComponent(DashbaordEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
