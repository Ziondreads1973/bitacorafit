import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilePage], // componente normal (NO standalone)
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule, // navegación / Router para AuthService, etc.
        HttpClientTestingModule, // por si el servicio usa HttpClient
        IonicStorageModule.forRoot(), // Storage para StorageService/AuthService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProfilePage);
        component = fixture.componentInstance;
        // No llamamos fixture.detectChanges() para no disparar ngOnInit
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
