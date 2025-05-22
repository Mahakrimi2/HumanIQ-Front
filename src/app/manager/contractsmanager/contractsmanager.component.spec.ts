import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsmanagerComponent } from './contractsmanager.component';

describe('ContractsmanagerComponent', () => {
  let component: ContractsmanagerComponent;
  let fixture: ComponentFixture<ContractsmanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContractsmanagerComponent]
    });
    fixture = TestBed.createComponent(ContractsmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
