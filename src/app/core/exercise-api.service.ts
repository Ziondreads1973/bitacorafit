import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Esta es la forma en que responde jsonplaceholder
interface PlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExerciseApiService {
  private readonly API_URL =
    'https://jsonplaceholder.typicode.com/posts?_limit=10';

  constructor(private http: HttpClient) {}

  /**
   * Devuelve un observable con posts de ejemplo desde jsonplaceholder.
   * Luego los vamos a mapear a "ejercicios recomendados" en la página.
   */
  fetchExercises(): Observable<PlaceholderPost[]> {
    return this.http.get<PlaceholderPost[]>(this.API_URL);
  }
}
