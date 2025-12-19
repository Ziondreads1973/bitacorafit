import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IonicModule,
  AlertController,
  ToastController,
  NavController,
} from '@ionic/angular';

import { SettingsPage } from './settings.page';
import { AuthService } from '../core/auth.service';
import { StorageService } from '../core/storage';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  const authMock = {
    getEmail: jasmine.createSpy('getEmail').and.returnValue('test@duoc.cl'),
    logout: jasmine.createSpy('logout').and.resolveTo(true),
  };

  const storageServiceMock = {
    get: jasmine.createSpy('get').and.resolveTo(null),
    set: jasmine.createSpy('set').and.resolveTo(true),
    remove: jasmine.createSpy('remove').and.resolveTo(true),
    clear: jasmine.createSpy('clear').and.resolveTo(true),
  };

  const navMock = { back: jasmine.createSpy('back') };

  const alertCtrlMock = {
    create: jasmine
      .createSpy('create')
      .and.resolveTo({ present: jasmine.createSpy('present') }),
  };

  const toastCtrlMock = {
    create: jasmine
      .createSpy('create')
      .and.resolveTo({ present: jasmine.createSpy('present') }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: NavController, useValue: navMock },
        { provide: AlertController, useValue: alertCtrlMock },
        { provide: ToastController, useValue: toastCtrlMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
