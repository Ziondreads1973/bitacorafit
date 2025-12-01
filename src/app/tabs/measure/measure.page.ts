import { Component, OnInit } from '@angular/core';
import { DataService, MeasurementEntry, ProgressEntry } from '../../core/data';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.page.html',
  styleUrls: ['./measure.page.scss'],
  standalone: false,
})
export class MeasurePage implements OnInit {
  lastWeight: MeasurementEntry | null = null;
  lastBodyFat: MeasurementEntry | null = null;

  progressEntries: ProgressEntry[] = [];
  isTakingPhoto = false;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter() {
    // Por si agregas datos en otra pantalla y luego vuelves a Measure
    this.refresh();
  }

  private refresh(): void {
    // Historial de peso
    const weightHistory = this.data.getMeasurements('weight');
    this.lastWeight =
      weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;

    // Historial de grasa corporal
    const fatHistory = this.data.getMeasurements('bodyFat');
    this.lastBodyFat =
      fatHistory.length > 0 ? fatHistory[fatHistory.length - 1] : null;

    // Progreso con fotos (galería)
    this.progressEntries = this.data.getProgressEntries();
  }

  async addProgressPhoto(): Promise<void> {
    this.isTakingPhoto = true;

    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 70,
      });

      if (!photo || !photo.dataUrl) {
        return;
      }

      const latestWeight = this.lastWeight?.value;

      const entry: ProgressEntry = {
        id: 'pr-' + Date.now().toString(),
        dateISO: new Date().toISOString(),
        weight: latestWeight,
        photoData: photo.dataUrl,
      };

      await this.data.addProgressEntry(entry);
      this.refresh();
    } catch (err) {
      console.error('Error taking progress photo', err);
    } finally {
      this.isTakingPhoto = false;
    }
  }
}
