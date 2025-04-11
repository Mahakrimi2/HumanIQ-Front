import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '43cd089ce28a644c9fc42776d02302fb'; // Remplacez par votre clé
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`
    );
  }
}
 
