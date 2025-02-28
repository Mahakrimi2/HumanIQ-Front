import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedContractsComponent } from './archived-contracts.component';

describe('ArchivedContractsComponent', () => {
  let component: ArchivedContractsComponent;
  let fixture: ComponentFixture<ArchivedContractsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedContractsComponent]
    });
    fixture = TestBed.createComponent(ArchivedContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
