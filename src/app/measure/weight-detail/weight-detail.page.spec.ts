import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeightDetailPage } from './weight-detail.page';

describe('WeightDetailPage', () => {
  let component: WeightDetailPage;
  let fixture: ComponentFixture<WeightDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
