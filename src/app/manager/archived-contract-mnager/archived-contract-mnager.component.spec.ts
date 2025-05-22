import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedContractMnagerComponent } from './archived-contract-mnager.component';

describe('ArchivedContractMnagerComponent', () => {
  let component: ArchivedContractMnagerComponent;
  let fixture: ComponentFixture<ArchivedContractMnagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArchivedContractMnagerComponent]
    });
    fixture = TestBed.createComponent(ArchivedContractMnagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
