import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanymanagerComponent } from './companymanager.component';

describe('CompanymanagerComponent', () => {
  let component: CompanymanagerComponent;
  let fixture: ComponentFixture<CompanymanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanymanagerComponent]
    });
    fixture = TestBed.createComponent(CompanymanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
