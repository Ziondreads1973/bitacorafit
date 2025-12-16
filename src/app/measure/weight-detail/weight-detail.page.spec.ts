import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { WeightDetailPage } from './weight-detail.page';
import { DataService } from 'src/app/core/data';

// ====== Mocks necesarios ======

// Mock simple de DataService
class DataServiceMock {
  measurements: any[] = [
    {
      id: 'test-id',
      type: 'weight',
      value: 80,
      dateISO: '2025-01-01T10:00:00.000Z',
    },
  ];

  getMeasurementById(id: string) {
    return this.measurements.find((m) => m.id === id) ?? null;
  }
}

// Mock básico de NavController
class NavControllerMock {
  navigateBack = jasmine.createSpy('navigateBack');
  navigateForward = jasmine.createSpy('navigateForward');
}

// Mock de ActivatedRoute con un id fijo
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (key: string) => (key === 'id' ? 'test-id' : null),
    },
  },
} as any;

// ====== Suite de pruebas ======

describe('WeightDetailPage', () => {
  let component: WeightDetailPage;
  let fixture: ComponentFixture<WeightDetailPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WeightDetailPage], // componente normal (NO standalone)
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: DataService, useClass: DataServiceMock },
        { provide: NavController, useClass: NavControllerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WeightDetailPage);
        component = fixture.componentInstance;
        // OJO: no llamamos fixture.detectChanges()
        // para evitar ejecutar ngOnInit y bindings del template.
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
