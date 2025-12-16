import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage], // componente normal (NO standalone)
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule, // Router para AuthService / navegación
        HttpClientTestingModule, // por si AuthService usa HttpClient
        IonicStorageModule.forRoot(), // Storage para StorageService/AuthService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        // OJO: no llamamos fixture.detectChanges() para no disparar ngOnInit ni bindings
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
