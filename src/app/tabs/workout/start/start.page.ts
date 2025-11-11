import { Component } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  AnimationController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { DataService, Exercise, WorkoutSession } from 'src/app/core/data';

type SetDraft = {
  kg: number | null;
  reps: number | null;
  done: boolean;
  valid: boolean;
};
type EditorExercise = {
  id: string;
  name: string;
  previous?: string;
  sets: SetDraft[];
};

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false,
})
export class StartPage {
  title = 'Evening Workout';
  durationStart = Date.now();
  items: EditorExercise[] = [];

  constructor(
    private data: DataService,
    private nav: NavController,
    private toast: ToastController,
    private sheet: ActionSheetController,
    private animCtrl: AnimationController
  ) {
    // Semilla: intenta bench, si no existe toma el primero disponible o crea uno temporal
    const bench =
      this.data.exercises.find((e) => e.id === 'ex-bench') ||
      this.data.exercises[0] ||
      ({ id: 'ex-temp', name: 'Bench Press', bodyPart: 'Chest' } as Exercise);

    this.items = [this.newEditorExercise(bench)];
  }

  // ==== Helpers UI / performance ====
  trackByEx = (_: number, ex: EditorExercise) => ex.id;
  trackBySet = (i: number) => i;

  // ==== Construcción de items ====
  newEditorExercise(ex: Exercise): EditorExercise {
    return {
      id: ex.id,
      name: ex.name,
      previous: this.buildPreviousText(ex.id),
      sets: [{ kg: null, reps: null, done: false, valid: false }],
    };
  }

  buildPreviousText(exerciseId: string): string | undefined {
    const last = this.data.workouts.find((w) =>
      w.exercises?.some((e) => e.exerciseId === exerciseId)
    );
    if (!last) return undefined;
    const e = last.exercises.find((x) => x.exerciseId === exerciseId)!;
    const s = e.sets[e.sets.length - 1];
    return `${s.kg} kg × ${s.reps}`;
  }

  // ==== Edición de sets/ejercicios ====
  addSet(ix: number) {
    this.items[ix].sets.push({
      kg: null,
      reps: null,
      done: false,
      valid: false,
    });
  }

  removeSet(ix: number, jx: number) {
    if (this.items[ix].sets.length > 1) {
      this.items[ix].sets.splice(jx, 1);
    }
  }

  async addExercise() {
    const buttons: ActionSheetButton[] = this.data.exercises.map((ex) => ({
      text: ex.name,
      handler: () => {
        this.items.push(this.newEditorExercise(ex));
      }, // retorna void (ok)
    }));
    buttons.push({ text: 'Cancel', role: 'cancel' });

    const as = await this.sheet.create({ header: 'Add exercise', buttons });
    await as.present();
  }

  // Nota: el template pasa #chk (IonIcon). Usamos tipo laxo para evitar error TS con HTMLElement.
  toggleDone(ix: number, jx: number, ev?: Event) {
    const set = this.items[ix].sets[jx];
    set.valid = this.isValid(set.kg, set.reps);
    if (!set.valid) {
      set.done = false;
      return;
    }
    set.done = !set.done;

    // Usa el nodo real del evento (ion-icon)
    const el =
      (ev?.currentTarget as HTMLElement) ?? (ev?.target as HTMLElement);
    if (!el) return; // evita el error si algo raro pasa

    this.animCtrl
      .create()
      .addElement(el) // <- ahora es un HTMLElement válido
      .duration(140)
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.6, transform: 'scale(1.15)' },
        { offset: 1, transform: 'scale(1)' },
      ])
      .play();
  }

  // ==== Entrada solo numérica (para ion-input) ====
  allowOnlyDigits(ev: KeyboardEvent) {
    const allowed = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
    ];
    if (allowed.includes(ev.key)) return;
    if (!/^\d$/.test(ev.key)) ev.preventDefault();
  }

  onIntInput(ev: any, ix: number, jx: number, field: 'kg' | 'reps') {
    const raw: string = ev?.detail?.value ?? '';
    const digits = raw.replace(/\D+/g, '');
    let num: number | null = digits === '' ? null : Number(digits);

    // Reglas rápidas (puedes ajustar):
    if (field === 'reps' && num !== null) {
      // reps entre 1 y 100
      num = Math.max(1, Math.min(100, num));
    }
    if (field === 'kg' && num !== null) {
      // kg no negativo (sin tope superior por ahora)
      num = Math.max(0, num);
    }

    const s = this.items[ix].sets[jx];
    if (field === 'kg') s.kg = num;
    else s.reps = num;

    s.valid = this.isValid(s.kg, s.reps);
  }

  // ==== Validación y normalización ====
  private toNum(n: number | null): number | null {
    if (n === null || n === undefined) return null;
    const v = Number(n);
    return Number.isFinite(v) ? v : null;
  }

  isValid(kg: number | null, reps: number | null): boolean {
    const k = this.toNum(kg);
    const r = this.toNum(reps);
    const kOk = k !== null && k >= 0;
    const rOk = r !== null && Number.isInteger(r) && r >= 1 && r <= 100;
    return kOk && rOk;
  }

  get finishDisabled(): boolean {
    if (this.items.length === 0) return true;
    return !this.items.some((ex) =>
      ex.sets.some((s) => this.isValid(s.kg, s.reps))
    );
  }

  // ==== Guardado / cancelación ====
  async finish() {
    if (this.finishDisabled) {
      const t = await this.toast.create({
        message: 'Please complete at least one valid set',
        duration: 1600,
        color: 'warning',
      });
      return t.present();
    }

    const now = new Date();
    const session: WorkoutSession = {
      id: 'w' + now.getTime(),
      title: this.title?.trim() || 'Workout',
      dateISO: now.toISOString(),
      durationMin: Math.max(
        1,
        Math.round((Date.now() - this.durationStart) / 60000)
      ),
      kpis: { volumeKg: 0, prs: 0 },
      exercises: this.items.map((ex) => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: ex.sets
          .filter((s) => this.isValid(s.kg, s.reps))
          .map((s) => ({ kg: Number(s.kg), reps: Number(s.reps) })),
      })),
    };

    // Σ kg×reps
    const volumeKg = session.exercises.reduce(
      (sum, e) => sum + e.sets.reduce((acc, s) => acc + s.kg * s.reps, 0),
      0
    );
    session.kpis = { ...(session.kpis ?? {}), volumeKg };

    this.data.addWorkout(session);

    const t = await this.toast.create({
      message: 'Workout saved',
      duration: 1200,
      color: 'success',
    });
    await t.present();

    this.nav.navigateRoot('/tabs/history');
  }

  async cancel() {
    const t = await this.toast.create({
      message: 'Workout discarded',
      duration: 1000,
      color: 'medium',
    });
    await t.present();
    this.nav.back();
  }
}
