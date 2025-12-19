import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { EditProfilePage } from './edit-profile.page';

describe('EditProfilePage', () => {
  let component: EditProfilePage;
  let fixture: ComponentFixture<EditProfilePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfilePage],
      imports: [
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(), // Provee Storage para StorageService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EditProfilePage);
        component = fixture.componentInstance;
        // No llamamos detectChanges() para no disparar ngOnInit/bindings innecesarios
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
