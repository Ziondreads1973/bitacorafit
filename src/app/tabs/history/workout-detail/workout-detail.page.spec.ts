import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

import { WorkoutDetailPage } from './workout-detail.page';
import { DataService } from 'src/app/core/data';

describe('WorkoutDetailPage', () => {
  let component: WorkoutDetailPage;
  let fixture: ComponentFixture<WorkoutDetailPage>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkoutDetailPage],
      imports: [IonicModule.forRoot()],
      providers: [
        // Stubs mínimos: no necesitamos comportamiento real
        { provide: ActivatedRoute, useValue: {} },
        { provide: DataService, useValue: {} },
        { provide: NavController, useValue: {} },
        { provide: ToastController, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDetailPage);
    component = fixture.componentInstance;
    // IMPORTANTE: NO llamamos fixture.detectChanges()
    // => no se ejecuta ngOnInit ni se usa DataService/ActivatedRoute.
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
