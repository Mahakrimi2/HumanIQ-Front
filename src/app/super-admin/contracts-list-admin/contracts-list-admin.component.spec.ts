import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsListAdminComponent } from './contracts-list-admin.component';

describe('ContractsListAdminComponent', () => {
  let component: ContractsListAdminComponent;
  let fixture: ComponentFixture<ContractsListAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractsListAdminComponent]
    });
    fixture = TestBed.createComponent(ContractsListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
