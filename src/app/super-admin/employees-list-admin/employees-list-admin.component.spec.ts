import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesListAdminComponent } from './employees-list-admin.component';

describe('EmployeesListAdminComponent', () => {
  let component: EmployeesListAdminComponent;
  let fixture: ComponentFixture<EmployeesListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeesListAdminComponent]
    });
    fixture = TestBed.createComponent(EmployeesListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
