import { TestBed } from '@angular/core/testing';

import { JobOffreService } from './job-offre.service';

describe('JobOffreService', () => {
  let service: JobOffreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobOffreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
