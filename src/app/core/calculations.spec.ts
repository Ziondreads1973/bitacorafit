import { TestBed } from '@angular/core/testing';

import { Calculations } from './calculations';

describe('Calculations', () => {
  let service: Calculations;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Calculations);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
