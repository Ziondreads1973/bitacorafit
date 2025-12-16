import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  ToastController,
  ActionSheetController,
  AnimationController,
} from '@ionic/angular';
import { StartPage } from './start.page';
import { DataService } from 'src/app/core/data';

// ====== Mocks de servicios necesarios ======

class DataServiceMock {
  exercises = [{ id: 'ex-bench', name: 'Bench Press', bodyPart: 'Chest' }];
  workouts: any[] = [];

  // Nuevo: mock para el método que ahora llama StartPage en ngOnInit
  loadFromStorage = jasmine
    .createSpy('loadFromStorage')
    .and.returnValue(Promise.resolve());

  addWorkout = jasmine.createSpy('addWorkout');
}

class NavControllerMock {
  navigateRoot = jasmine.createSpy('navigateRoot');
  back = jasmine.createSpy('back');
}

class ToastControllerMock {
  create = jasmine.createSpy('create').and.callFake((opts: any) =>
    Promise.resolve({
      present: jasmine.createSpy('present'),
      ...opts,
    } as any)
  );
}

class ActionSheetControllerMock {
  create = jasmine.createSpy('create').and.callFake((opts: any) =>
    Promise.resolve({
      present: jasmine.createSpy('present'),
      ...opts,
    } as any)
  );
}

class AnimationMock {
  addElement(_el: any) {
    return this;
  }
  duration(_ms: number) {
    return this;
  }
  keyframes(_kf: any[]) {
    return this;
  }
  play = jasmine.createSpy('play');
}

class AnimationControllerMock {
  create = jasmine.createSpy('create').and.returnValue(new AnimationMock());
}

// ====== Suite de pruebas ======

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [StartPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DataService, useClass: DataServiceMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: ActionSheetController, useClass: ActionSheetControllerMock },
        { provide: AnimationController, useClass: AnimationControllerMock },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(StartPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar al menos un ejercicio en items', () => {
    expect(component.items.length).toBeGreaterThan(0);
    const ex = component.items[0];
    expect(ex.sets.length).toBe(1);
  });

  it('finishDisabled debería ser true si no hay sets válidos', () => {
    // Por defecto, el set inicial tiene kg/reps null => inválido
    expect(component.finishDisabled).toBeTrue();
  });

  it('finishDisabled debería ser false cuando hay al menos un set válido', () => {
    // Forzamos un set válido
    component.items[0].sets[0].kg = 60;
    component.items[0].sets[0].reps = 8;
    fixture.detectChanges();

    expect(component.finishDisabled).toBeFalse();
  });
});
