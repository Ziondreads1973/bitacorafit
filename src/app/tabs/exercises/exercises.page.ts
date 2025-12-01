import { Component, OnInit } from '@angular/core';
import { ExerciseApiService } from '../../core/exercise-api.service';
import { DataService, ExerciseCatalogItem } from '../../core/data';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
  standalone: false,
})
export class ExercisesPage implements OnInit {
  exercises: ExerciseCatalogItem[] = [];
  isLoading = false;
  errorMessage = '';
  isOfflineData = false;

  constructor(private api: ExerciseApiService, private data: DataService) {}

  ngOnInit() {
    // Al cargar la página intentamos traer datos desde la API
    this.loadFromApi();
  }

  /**
   * Lógica principal de carga desde la API.
   * Si falla, intenta mostrar datos cacheados desde Storage.
   * Puede ser llamada también por el ion-refresher.
   */
  loadFromApi(event?: any) {
    this.isLoading = true;
    this.errorMessage = '';
    this.isOfflineData = false;

    this.api.fetchExercises().subscribe({
      next: (posts) => {
        // Mapeamos los "posts" de jsonplaceholder a nuestro modelo de catálogo
        const mapped: ExerciseCatalogItem[] = posts.map((p) => ({
          id: String(p.id),
          name: p.title,
          description: p.body,
        }));

        // Guardamos en DataService y en Storage
        this.data.setExerciseCatalog(mapped).then(() => {
          this.exercises = this.data.getExerciseCatalog();
          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        });
      },
      error: (err) => {
        console.error('Error llamando a la API de ejercicios', err);
        const status = err?.status ?? 0;

        this.errorMessage =
          'No se pudo conectar a la API (código ' +
          status +
          '). ' +
          'Se intentará mostrar datos almacenados con anterioridad.';

        // Intentamos cargar el catálogo desde Storage (modo offline)
        this.data.loadExerciseCatalogFromStorage().then(() => {
          this.exercises = this.data.getExerciseCatalog();

          if (this.exercises.length > 0) {
            this.isOfflineData = true;
          } else {
            this.errorMessage += ' No hay datos almacenados todavía.';
          }

          this.isLoading = false;
          if (event) {
            event.target.complete();
          }
        });
      },
    });
  }

  /**
   * Se engancha al ion-refresher en el HTML.
   */
  doRefresh(event: any) {
    this.loadFromApi(event);
  }
}
