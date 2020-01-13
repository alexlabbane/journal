import { TestBed } from '@angular/core/testing';

import { EntryServiceService } from './entry-service.service';

describe('EntryServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntryServiceService = TestBed.get(EntryServiceService);
    expect(service).toBeTruthy();
  });
});
