// src/app/core/sqlite.service.ts
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage';

// El plugin cordova-sqlite-storage expone `window.sqlitePlugin` en entorno nativo
declare const window: any;

@Injectable({ providedIn: 'root' })
export class SqliteService {
  private db: any | null = null;
  private isNativeDbReady = false;
  private ready: Promise<void>;

  constructor(private platform: Platform, private storage: StorageService) {
    this.ready = this.init();
  }

  private async init(): Promise<void> {
    await this.platform.ready();

    const isNative =
      this.platform.is('android') ||
      this.platform.is('ios') ||
      this.platform.is('capacitor') ||
      this.platform.is('hybrid');

    const sqlitePlugin = (window as any)?.sqlitePlugin;

    if (!isNative || !sqlitePlugin) {
      // Modo fallback (web / sin plugin)
      console.warn(
        '[SqliteService] Ejecutando en modo fallback (StorageService)'
      );
      this.db = null;
      this.isNativeDbReady = false;
      return;
    }

    try {
      this.db = sqlitePlugin.openDatabase({
        name: 'bitacorafit.db',
        location: 'default',
      });

      await new Promise<void>((resolve, _reject) => {
        this.db.transaction(
          (tx: any) => {
            tx.executeSql(
              `CREATE TABLE IF NOT EXISTS workouts (
                 id TEXT PRIMARY KEY,
                 title TEXT NOT NULL,
                 date_iso TEXT NOT NULL,
                 duration_min INTEGER,
                 kpis_json TEXT,
                 exercises_json TEXT
               );`
            );
          },
          (err: any) => {
            console.error('[SqliteService] Error creando tabla workouts', err);
            this.isNativeDbReady = false;
            // No lanzamos el error para no romper la app; caerá en fallback
            resolve();
          },
          () => {
            this.isNativeDbReady = true;
            resolve();
          }
        );
      });
    } catch (err) {
      console.error('[SqliteService] Error inicializando SQLite', err);
      this.db = null;
      this.isNativeDbReady = false;
    }
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  /**
   * Obtiene todos los workouts persistidos.
   * - En nativo: SELECT sobre SQLite
   * - En web/fallback: lectura desde StorageService
   */
  async getAllWorkouts(): Promise<any[]> {
    await this.ensureReady();

    if (this.db && this.isNativeDbReady) {
      return new Promise<any[]>((resolve, reject) => {
        this.db.transaction(
          (tx: any) => {
            tx.executeSql(
              `SELECT id, title, date_iso, duration_min, kpis_json, exercises_json
               FROM workouts
               ORDER BY date_iso DESC;`,
              [],
              (_tx: any, rs: any) => {
                const items: any[] = [];
                for (let i = 0; i < rs.rows.length; i++) {
                  const row = rs.rows.item(i);
                  items.push({
                    id: row.id,
                    title: row.title,
                    dateISO: row.date_iso,
                    durationMin: row.duration_min,
                    kpis: row.kpis_json ? JSON.parse(row.kpis_json) : undefined,
                    exercises: row.exercises_json
                      ? JSON.parse(row.exercises_json)
                      : [],
                  });
                }
                resolve(items);
              }
            );
          },
          (err: any) => {
            console.error('[SqliteService] Error en SELECT workouts', err);
            reject(err);
          }
        );
      });
    }

    // Fallback: StorageService (web / sin plugin)
    const stored = await this.storage.get<any[]>('workouts');
    return stored ?? [];
  }

  /**
   * Inserta o reemplaza un workout.
   * Recibe un objeto "session" tal como lo maneja DataService.
   */
  async insertWorkout(session: any): Promise<void> {
    await this.ensureReady();

    if (this.db && this.isNativeDbReady) {
      const kpisJson = session.kpis ? JSON.stringify(session.kpis) : null;
      const exercisesJson = session.exercises
        ? JSON.stringify(session.exercises)
        : '[]';

      return new Promise<void>((resolve, reject) => {
        this.db.transaction(
          (tx: any) => {
            tx.executeSql(
              `INSERT OR REPLACE INTO workouts
                 (id, title, date_iso, duration_min, kpis_json, exercises_json)
               VALUES (?, ?, ?, ?, ?, ?);`,
              [
                session.id,
                session.title,
                session.dateISO,
                session.durationMin ?? null,
                kpisJson,
                exercisesJson,
              ],
              () => resolve(),
              (_tx: any, err: any) => {
                console.error('[SqliteService] Error en INSERT workout', err);
                reject(err);
              }
            );
          },
          (err: any) => {
            console.error('[SqliteService] Error en transacción INSERT', err);
            reject(err);
          }
        );
      });
    }

    // Fallback: persistimos en StorageService como arreglo de sesiones
    const current = (await this.storage.get<any[]>('workouts')) ?? [];
    await this.storage.set('workouts', [session, ...current]);
  }
}
