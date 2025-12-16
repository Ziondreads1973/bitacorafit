import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { HistoryPage } from './history.page';
import { DataService, WorkoutSession } from 'src/app/core/data';

// ====== Mocks ======

class DataServiceMock {
  // Dos entrenos con fechas diferentes para probar el orden descendente
  workouts: WorkoutSession[] = [
    {
      id: 'w1',
      title: 'Older Workout',
      dateISO: '2025-01-01T10:00:00.000Z',
      durationMin: 60,
      kpis: { volumeKg: 1000, prs: 0 },
      exercises: [],
    },
    {
      id: 'w2',
      title: 'Newer Workout',
      dateISO: '2025-02-01T10:00:00.000Z',
      durationMin: 45,
      kpis: { volumeKg: 2000, prs: 1 },
      exercises: [],
    },
  ];

  // Mock del método usado por HistoryPage.refresh()
  loadFromStorage = jasmine
    .createSpy('loadFromStorage')
    .and.returnValue(Promise.resolve());

  // Mock de getAllWorkouts para imitar al DataService real
  getAllWorkouts = jasmine.createSpy('getAllWorkouts').and.callFake(() => {
    // Devolvemos una copia ordenada por fecha DESC (más reciente primero)
    return [...this.workouts].sort((a, b) =>
      a.dateISO < b.dateISO ? 1 : a.dateISO > b.dateISO ? -1 : 0
    );
  });
}

class RouterMock {
  navigate = jasmine.createSpy('navigate');
}

// ====== Suite ======

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;
  let router: RouterMock;
  let dataService: DataServiceMock;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: DataService, useClass: DataServiceMock },
        { provide: Router, useClass: RouterMock },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HistoryPage);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as unknown as RouterMock;
        dataService = TestBed.inject(DataService) as unknown as DataServiceMock;
        // No llamamos fixture.detectChanges() aquí para tener control explícito
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los workouts ordenados por fecha descendente', async () => {
    // Simulamos la entrada a la vista
    await component.ionViewWillEnter();

    const ids = component.items.map((w) => w.id);
    expect(ids).toEqual(['w2', 'w1']); // w2 es más reciente que w1
  });

  it('ionViewWillEnter debería refrescar los items desde el servicio', async () => {
    // Cambiamos el orden en el mock a propósito
    dataService.workouts = [...dataService.workouts].reverse();

    // Llamamos al hook manualmente
    await component.ionViewWillEnter();

    const ids = component.items.map((w) => w.id);
    // Aunque el array interno esté al revés, getAllWorkouts/HistoryPage
    // debe entregar orden DESC por dateISO
    expect(ids).toEqual(['w2', 'w1']);
  });

  it('openDetail debería navegar a la ruta de detalle con el id correcto', async () => {
    // Aseguramos que haya items cargados
    await component.ionViewWillEnter();

    const target = component.items[0]; // w2 (el más reciente)
    component.openDetail(target);

    expect(router.navigate).toHaveBeenCalledWith([
      '/tabs',
      'history',
      'workout-detail',
      target.id,
    ]);
  });
});
