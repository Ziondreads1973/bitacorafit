import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ExercisesPage } from './exercises.page';

describe('ExercisesPage', () => {
  let component: ExercisesPage;
  let fixture: ComponentFixture<ExercisesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExercisesPage], // componente normal (no standalone)
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // HttpClient para ExerciseApiService
        IonicStorageModule.forRoot(), // Storage para StorageService/DataService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ExercisesPage);
        component = fixture.componentInstance;
        // No llamamos fixture.detectChanges() para no disparar ngOnInit
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
