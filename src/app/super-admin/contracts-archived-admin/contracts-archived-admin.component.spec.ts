import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsArchivedAdminComponent } from './contracts-archived-admin.component';

describe('ContractsArchivedAdminComponent', () => {
  let component: ContractsArchivedAdminComponent;
  let fixture: ComponentFixture<ContractsArchivedAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractsArchivedAdminComponent]
    });
    fixture = TestBed.createComponent(ContractsArchivedAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
