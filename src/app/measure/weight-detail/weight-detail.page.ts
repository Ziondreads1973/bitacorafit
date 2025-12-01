import { Component, OnInit } from '@angular/core';
import { DataService, MeasurementEntry } from '../../core/data';

@Component({
  selector: 'app-weight-detail',
  templateUrl: './weight-detail.page.html',
  styleUrls: ['./weight-detail.page.scss'],
  standalone: false,
})
export class WeightDetailPage implements OnInit {
  items: MeasurementEntry[] = [];
  newValue: number | null = null;
  isSaving = false;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.refresh();
  }

  ionViewWillEnter() {
    // Por si vuelves a esta pantalla después de agregar datos
    this.refresh();
  }

  private refresh(): void {
    // Trae todas las mediciones de tipo 'weight'
    this.items = this.data.getMeasurements('weight');
  }

  trackById = (_: number, m: MeasurementEntry) => m.id;

  async addEntry() {
    if (this.newValue == null || isNaN(this.newValue)) {
      return;
    }

    this.isSaving = true;

    const entry: MeasurementEntry = {
      id: 'mw-' + Date.now().toString(),
      type: 'weight',
      value: this.newValue,
      dateISO: new Date().toISOString(),
      unit: 'kg',
    };

    // Esto actualiza el estado en memoria y, si ya hiciste el paso anterior,
    // también lo persiste en Storage.
    this.data.addMeasurement(entry);

    this.newValue = null;
    this.refresh();
    this.isSaving = false;
  }
}
