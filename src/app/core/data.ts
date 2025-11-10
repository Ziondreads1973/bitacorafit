// src/app/core/data.ts
import { Injectable } from '@angular/core';

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  image?: string;
}

export interface SetEntry { kg: number; reps: number; rpe?: number; }

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  dateISO: string;              // ISO-8601
  durationMin?: number;
  kpis?: { volumeKg?: number; prs?: number };
  exercises: WorkoutExercise[];
}

export interface MeasurementEntry {
  id: string;
  type: 'weight' | 'bodyFat';
  value: number;                // kg o %
  dateISO: string;
  unit?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
  // ====== Seeds ======
  private _exercises: Exercise[] = [
    { id: 'ex-abw',   name: 'Ab Wheel',       bodyPart: 'Core',    image: 'assets/exercises/ab-wheel.png' },
    { id: 'ex-bench', name: 'Bench Press',    bodyPart: 'Chest' },
    { id: 'ex-squat', name: 'Back Squat',     bodyPart: 'Legs' },
    { id: 'ex-ohp',   name: 'Overhead Press', bodyPart: 'Shoulders' },
    { id: 'ex-row',   name: 'Barbell Row',    bodyPart: 'Back' },
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
          sets: [{ kg: 60, reps: 10, rpe: 9 }, { kg: 62.5, reps: 8 }, { kg: 65, reps: 6 }]
        },
        {
          exerciseId: 'ex-row',
          name: 'Barbell Row',
          sets: [{ kg: 50, reps: 10 }, { kg: 55, reps: 8 }]
        }
      ]
    },
    {
      id: 'w2',
      title: 'Push Day',
      dateISO: '2025-09-16T19:05:00',
      durationMin: 75,
      kpis: { volumeKg: 5314, prs: 3 },
      exercises: [
        { exerciseId: 'ex-ohp', name: 'Overhead Press', sets: [{ kg: 35, reps: 8 }, { kg: 37.5, reps: 6 }] }
      ]
    }
  ];

  private _measurements: MeasurementEntry[] = [
    { id: 'm1', type: 'weight',  value: 89.8, dateISO: '2025-03-19T08:12:00', unit: 'kg' },
    { id: 'm2', type: 'weight',  value: 91.1, dateISO: '2025-03-13T09:10:00', unit: 'kg' },
    { id: 'm3', type: 'bodyFat', value: 21.5, dateISO: '2025-03-12T09:10:00', unit: '%'  },
  ];

  // ====== Getters simples ======
  get exercises(): Exercise[] { return this._exercises; }
  get workouts(): WorkoutSession[] { return this._workouts; }

  getMeasurements(type: MeasurementEntry['type']): MeasurementEntry[] {
    return this._measurements
      .filter(m => m.type === type)
      .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  }

  // ====== Helpers ======
  findExerciseById(id: string): Exercise | null {
    return this._exercises.find(e => e.id === id) ?? null;
  }

  /** Alias cómodo para compatibilidad con páginas de detalle */
  findWorkoutById(id: string): WorkoutSession | null {
    return this._workouts.find(w => w.id === id) ?? null;
  }

  /** Tu versión original; la dejo por compatibilidad */
  getWorkoutById(id: string): WorkoutSession | null {
    return this.findWorkoutById(id);
  }

  /** Lista todas las sesiones ordenadas por fecha (desc) */
  getAllWorkouts(): WorkoutSession[] {
    return [...this._workouts].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  }

  // ====== Mutadores ======
  addWorkout(ws: WorkoutSession): void {
    // prepend para que lo último quede arriba
    this._workouts = [ws, ...this._workouts];
  }

  addMeasurement(entry: MeasurementEntry): void {
    this._measurements = [...this._measurements, entry];
  }
}
