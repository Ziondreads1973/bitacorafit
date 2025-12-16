import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MeasurePage } from './measure.page';

describe('MeasurePage', () => {
  let component: MeasurePage;
  let fixture: ComponentFixture<MeasurePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MeasurePage], // componente normal (no standalone)
      imports: [
        IonicModule.forRoot(), // contexto Ionic
        IonicStorageModule.forRoot(), // Storage para StorageService/DataService
        HttpClientTestingModule, // por si usa HttpClient
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MeasurePage);
        component = fixture.componentInstance;
        // No llamamos fixture.detectChanges() para no disparar ngOnInit
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
