import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from '../../core/storage';
import { AuthService } from '../../core/auth.service';

export interface UserProfile {
  displayName: string;
  email: string;
  heightCm?: number | null;
  goalWeightKg?: number | null;
  avatarDataUrl?: string | null;
  updatedAtISO: string;
}

const PROFILE_KEY = 'user_profile_v1';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: false,
})
export class EditProfilePage implements OnInit {
  saving = false;

  // Se usa para previsualización inmediata del avatar
  avatarPreview: string | null = null;

  form = this.fb.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }],
    heightCm: [
      null as number | null,
      [Validators.min(50), Validators.max(250)],
    ],
    goalWeightKg: [
      null as number | null,
      [Validators.min(20), Validators.max(300)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private storage: StorageService,
    private auth: AuthService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  private async loadProfile(): Promise<void> {
    const email = this.auth.getEmail() ?? '';

    // 1) Email desde sesión
    this.form.patchValue({ email });

    // 2) Perfil persistido
    const stored = await this.storage.get<UserProfile>(PROFILE_KEY);
    if (stored) {
      this.form.patchValue({
        displayName: stored.displayName ?? '',
        heightCm: stored.heightCm ?? null,
        goalWeightKg: stored.goalWeightKg ?? null,
      });
      this.avatarPreview = stored.avatarDataUrl ?? null;
      return;
    }

    // 3) Seed mínimo si no hay perfil guardado
    const fallbackName = email ? email.split('@')[0] : 'Usuario';
    this.form.patchValue({ displayName: fallbackName });
  }

  async takeAvatar(): Promise<void> {
    try {
      const photo = await Camera.getPhoto({
        quality: 70,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      this.avatarPreview = photo.dataUrl ?? null;
    } catch (err) {
      // El usuario pudo cancelar; no lo tratamos como error fatal
      console.warn('[EditProfile] Camera cancelled or failed', err);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
  }

  async save(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      const t = await this.toast.create({
        message: 'Revisa los campos del formulario antes de guardar.',
        duration: 2000,
        position: 'bottom',
      });
      await t.present();
      return;
    }

    this.saving = true;
    try {
      const rawEmail = (this.form.get('email')?.value ?? '').toString();

      const profile: UserProfile = {
        displayName:
          this.form.get('displayName')?.value?.toString().trim() ?? 'Usuario',
        email: rawEmail,
        heightCm: this.form.get('heightCm')?.value ?? null,
        goalWeightKg: this.form.get('goalWeightKg')?.value ?? null,
        avatarDataUrl: this.avatarPreview,
        updatedAtISO: new Date().toISOString(),
      };

      await this.storage.set<UserProfile>(PROFILE_KEY, profile);

      const t = await this.toast.create({
        message: 'Perfil actualizado.',
        duration: 1500,
        position: 'bottom',
      });
      await t.present();

      this.nav.back();
    } finally {
      this.saving = false;
    }
  }

  back(): void {
    this.nav.back();
  }
}
