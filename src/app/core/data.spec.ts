import { TestBed } from '@angular/core/testing';
import { DataService } from './data';
import { StorageService } from './storage';
import { SqliteService } from './sqlite.service';

/**
 * Mock simple para StorageService (usa un Map en memoria).
 */
class StorageServiceMock {
  private store = new Map<string, any>();

  async get<T>(key: string): Promise<T | null> {
    return (this.store.get(key) as T) ?? null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

/**
 * Stub para SqliteService usando spies de Jasmine.
 */
class SqliteServiceStub {
  getAllWorkouts = jasmine
    .createSpy('getAllWorkouts')
    .and.returnValue(Promise.resolve([]));

  insertWorkout = jasmine
    .createSpy('insertWorkout')
    .and.returnValue(Promise.resolve());
}

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        { provide: StorageService, useClass: StorageServiceMock },
        { provide: SqliteService, useClass: SqliteServiceStub },
      ],
    });

    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debería devolver entrenamientos ordenados por fecha descendente', () => {
    // Preparamos datos controlados
    (service as any)._workouts = [
      {
        id: 'w1',
        title: 'Antiguo',
        dateISO: '2024-01-01T10:00:00',
        exercises: [],
      },
      {
        id: 'w2',
        title: 'Reciente',
        dateISO: '2024-02-01T10:00:00',
        exercises: [],
      },
    ];

    const ordered = service.getAllWorkouts();

    expect(ordered.length).toBe(2);
    expect(ordered[0].id).toBe('w2');
    expect(ordered[1].id).toBe('w1');
  });

  it('debería agregar un nuevo entrenamiento al inicio de la lista', async () => {
    // Dejamos el arreglo interno vacío para controlar mejor la prueba
    (service as any)._workouts = [];

    const newWorkout = {
      id: 'w100',
      title: 'Entrenamiento de prueba',
      dateISO: '2025-01-10T20:00:00',
      exercises: [],
    } as any;

    // addWorkout puede ser sync o async, por eso lo pasamos por "any" y usamos await
    await (service as any).addWorkout(newWorkout);

    const list = service.getAllWorkouts();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('w100');
    expect(list[0].title).toBe('Entrenamiento de prueba');
  });

  it('debería llamar a SqliteService.insertWorkout al agregar entrenamiento', async () => {
    const sqlite = TestBed.inject(
      SqliteService
    ) as unknown as SqliteServiceStub;
    (service as any)._workouts = [];

    const newWorkout = {
      id: 'w200',
      title: 'Desde test',
      dateISO: '2025-02-10T20:00:00',
      exercises: [],
    } as any;

    await (service as any).addWorkout(newWorkout);

    expect(sqlite.insertWorkout).toHaveBeenCalled();
    expect(sqlite.insertWorkout).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 'w200',
        title: 'Desde test',
      })
    );
  });

  it('debería poder filtrar mediciones por tipo (weight / bodyFat)', () => {
    // Sobrescribimos mediciones para no depender de los seeds
    (service as any)._measurements = [
      {
        id: 'm1',
        type: 'weight',
        value: 80,
        dateISO: '2024-01-01T08:00:00',
      },
      {
        id: 'm2',
        type: 'bodyFat',
        value: 20,
        dateISO: '2024-01-02T08:00:00',
      },
      {
        id: 'm3',
        type: 'weight',
        value: 81,
        dateISO: '2024-01-03T08:00:00',
      },
    ];

    const weight = service.getMeasurements('weight');
    const bodyFat = service.getMeasurements('bodyFat');

    expect(weight.length).toBe(2);
    expect(weight.every((m) => m.type === 'weight')).toBeTrue();

    expect(bodyFat.length).toBe(1);
    expect(bodyFat[0].type).toBe('bodyFat');
  });
});
