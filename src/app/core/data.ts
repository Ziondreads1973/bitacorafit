// src/app/core/data.ts
import { Injectable } from '@angular/core';
import { StorageService } from './storage';
import { SqliteService } from './sqlite.service';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  image?: string;
}

export interface SetEntry {
  kg: number;
  reps: number;
  rpe?: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  dateISO: string; // ISO-8601
  durationMin?: number;
  kpis?: { volumeKg?: number; prs?: number };
  exercises: WorkoutExercise[];
}

export interface MeasurementEntry {
  id: string;
  type: 'weight' | 'bodyFat';
  value: number; // kg o %
  dateISO: string;
  unit?: string;
}

/**
 * Catálogo de ejercicios recomendado que viene desde la API
 * y se usa en la pestaña Exercises (con cache offline).
 */
export interface ExerciseCatalogItem {
  id: string;
  name: string;
  description: string;
}

/**
 * Entrada de progreso con foto (cámara) + fecha + peso opcional.
 */
export interface ProgressEntry {
  id: string;
  dateISO: string;
  weight?: number;
  photoData: string; // data URL (base64) de la foto
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // ====== Seeds ======
  private _exercises: Exercise[] = [
    {
      id: 'ex-abw',
      name: 'Ab Wheel',
      bodyPart: 'Core',
      image: 'assets/exercises/ab-wheel.png',
    },
    { id: 'ex-bench', name: 'Bench Press', bodyPart: 'Chest' },
    { id: 'ex-squat', name: 'Back Squat', bodyPart: 'Legs' },
    { id: 'ex-ohp', name: 'Overhead Press', bodyPart: 'Shoulders' },
    { id: 'ex-row', name: 'Barbell Row', bodyPart: 'Back' },
  ];

  private _workouts: WorkoutSession[] = [
    {
      id: 'w1',
      title: 'Evening Workout',
      dateISO: '2025-09-19T20:12:00',
      durationMin: 88,
      kpis: { volumeKg: 6542, prs: 0 },
      exercises: [
        {
          exerciseId: 'ex-bench',
          name: 'Bench Press',
          sets: [
            { kg: 60, reps: 10, rpe: 9 },
            { kg: 62.5, reps: 8 },
            { kg: 65, reps: 6 },
          ],
        },
        {
          exerciseId: 'ex-row',
          name: 'Barbell Row',
          sets: [
            { kg: 50, reps: 10 },
            { kg: 55, reps: 8 },
          ],
        },
      ],
    },
    {
      id: 'w2',
      title: 'Push Day',
      dateISO: '2025-09-16T19:05:00',
      durationMin: 75,
      kpis: { volumeKg: 5314, prs: 3 },
      exercises: [
        {
          exerciseId: 'ex-ohp',
          name: 'Overhead Press',
          sets: [
            { kg: 35, reps: 8 },
            { kg: 37.5, reps: 6 },
          ],
        },
      ],
    },
  ];

  private _measurements: MeasurementEntry[] = [
    {
      id: 'm1',
      type: 'weight',
      value: 89.8,
      dateISO: '2025-03-19T08:12:00',
      unit: 'kg',
    },
    {
      id: 'm2',
      type: 'weight',
      value: 91.1,
      dateISO: '2025-03-13T09:10:00',
      unit: 'kg',
    },
    {
      id: 'm3',
      type: 'bodyFat',
      value: 21.5,
      dateISO: '2025-03-12T09:10:00',
      unit: '%',
    },
  ];

  /**
   * Catálogo que viene desde la API (jsonplaceholder)
   * y se muestra en la pestaña Exercises.
   */
  private _exerciseCatalog: ExerciseCatalogItem[] = [];

  /**
   * Entradas de progreso con fotos (cámara).
   */
  private _progressEntries: ProgressEntry[] = [];

  // ====== Claves de Storage ======
  private readonly WORKOUTS_KEY = 'workouts';
  private readonly MEASUREMENTS_KEY = 'measurements';
  private readonly EXERCISES_KEY = 'exerciseCatalog';
  private readonly PROGRESS_KEY = 'progressEntries';

  constructor(private storage: StorageService, private sqlite: SqliteService) {}

  /**
   * Carga inicial desde la persistencia.
   * Para workouts:
   *  - En nativo: lee desde SQLite.
   *  - En web: usa el fallback de SqliteService (StorageService).
   * Para el resto: sigue usando StorageService directo.
   * Si no hay nada guardado, se mantienen los seeds definidos arriba.
   */
  async loadFromStorage(): Promise<void> {
    // Workouts desde persistencia nativa (SQLite o fallback)
    try {
      const storedWorkouts = await this.sqlite.getAllWorkouts();
      if (storedWorkouts && storedWorkouts.length > 0) {
        this._workouts = storedWorkouts as WorkoutSession[];
      }
    } catch (err) {
      console.warn(
        '[DataService] No se pudieron cargar workouts desde SQLite; se usan seeds en memoria',
        err
      );
    }

    // Measurements desde Storage
    const storedMeasurements = await this.storage.get<MeasurementEntry[]>(
      this.MEASUREMENTS_KEY
    );
    if (storedMeasurements && storedMeasurements.length > 0) {
      this._measurements = storedMeasurements;
    }

    // Catálogo de ejercicios (API) cacheado
    await this.loadExerciseCatalogFromStorage();

    // Progreso con fotos
    await this.loadProgressFromStorage();
  }

  // ====== Getters simples ======
  get exercises(): Exercise[] {
    return this._exercises;
  }

  get workouts(): WorkoutSession[] {
    return this._workouts;
  }

  getMeasurements(type: MeasurementEntry['type']): MeasurementEntry[] {
    return this._measurements
      .filter((m) => m.type === type)
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }

  /**
   * Catálogo de ejercicios de la API (en memoria)
   */
  getExerciseCatalog(): ExerciseCatalogItem[] {
    return this._exerciseCatalog;
  }

  /**
   * Entradas de progreso con fotos (en memoria)
   */
  getProgressEntries(): ProgressEntry[] {
    return this._progressEntries;
  }

  // ====== Helpers ======
  findExerciseById(id: string): Exercise | null {
    return this._exercises.find((e) => e.id === id) ?? null;
  }

  /** Alias cómodo para compatibilidad con páginas de detalle */
  findWorkoutById(id: string): WorkoutSession | null {
    return this._workouts.find((w) => w.id === id) ?? null;
  }

  /** Versión original; se mantiene por compatibilidad */
  getWorkoutById(id: string): WorkoutSession | null {
    return this.findWorkoutById(id);
  }

  /** Lista todas las sesiones ordenadas por fecha (desc) */
  getAllWorkouts(): WorkoutSession[] {
    return [...this._workouts].sort((a, b) =>
      b.dateISO.localeCompare(a.dateISO)
    );
  }

  // ====== Mutadores ======

  /**
   * Agrega un workout:
   *  - Actualiza el array en memoria (para que la UI se refresque inmediato).
   *  - Persiste en SQLite (o, en web, en Storage a través de SqliteService).
   *
   * Se mantiene firma sync (void) para no romper los llamados existentes;
   * la persistencia se hace de forma asíncrona en segundo plano.
   */
  addWorkout(ws: WorkoutSession): void {
    // prepend para que lo último quede arriba
    this._workouts = [ws, ...this._workouts];
    // Guardamos en la capa de persistencia nativa (SQLite / fallback)
    void this.sqlite.insertWorkout(ws);
  }

  addMeasurement(entry: MeasurementEntry): void {
    this._measurements = [...this._measurements, entry];
    void this.persistMeasurements(); // guardamos cambios en Storage
  }

  /**
   * Persiste el arreglo de measurements en Storage.
   */
  private async persistMeasurements(): Promise<void> {
    await this.storage.set<MeasurementEntry[]>(
      this.MEASUREMENTS_KEY,
      this._measurements
    );
  }

  /**
   * Carga el catálogo de ejercicios desde Storage.
   * Se usa cuando falla la API (modo offline) o al iniciar la app.
   */
  async loadExerciseCatalogFromStorage(): Promise<void> {
    const stored = await this.storage.get<ExerciseCatalogItem[]>(
      this.EXERCISES_KEY
    );
    if (stored && stored.length > 0) {
      this._exerciseCatalog = stored;
    }
  }

  /**
   * Actualiza el catálogo de ejercicios en memoria y Storage.
   * Se usa cuando la llamada a la API es exitosa.
   */
  async setExerciseCatalog(items: ExerciseCatalogItem[]): Promise<void> {
    this._exerciseCatalog = items;
    await this.storage.set<ExerciseCatalogItem[]>(
      this.EXERCISES_KEY,
      this._exerciseCatalog
    );
  }

  /**
   * Carga las entradas de progreso (fotos) desde Storage.
   */
  async loadProgressFromStorage(): Promise<void> {
    const stored = await this.storage.get<ProgressEntry[]>(this.PROGRESS_KEY);
    if (stored && stored.length > 0) {
      this._progressEntries = stored;
    }
  }

  /**
   * Agrega una nueva entrada de progreso y la persiste.
   */
  async addProgressEntry(entry: ProgressEntry): Promise<void> {
    this._progressEntries = [entry, ...this._progressEntries];
    await this.storage.set<ProgressEntry[]>(
      this.PROGRESS_KEY,
      this._progressEntries
    );
  }
}
