import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoginDTO, AuthRequest, AuthModel } from '../models/auth.model';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  register(registerData: any, id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .post<any>(
        `http://localhost:8082/api/rh/register?id=` + id,
        registerData,
        {
          responseType: 'text' as 'json',
          headers: headers,
        }
      )
      .pipe(catchError(this.handleError));
  }

  login(authRequest: AuthRequest): Observable<LoginDTO> {
    console.log('Envoi de la requête de connexion:', authRequest);
    return this.http.post<LoginDTO>(`${this.apiUrl}/login`, authRequest).pipe(
      tap((response: LoginDTO) => {
        console.log('Réponse reçue:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error("Une erreur s'est produite:", error);
    let errorMessage = 'Une erreur inconnue est survenue.';

    if (error.status === 0) {
      errorMessage = 'Erreur de connexion au serveur.';
    } else if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;
    }

    return throwError(errorMessage);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  updatePassword(token: string, newPassword: string): Observable<any> {
    return this.http
      .post<any>(`http://localhost:8082/api/password/reset`, null, {
        params: {
          token: token,
          newPassword: newPassword,
        },
      })
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la réinitialisation:', error);
          return throwError(
            () =>
              new Error(
                error.error?.message ||
                  'Erreur lors de la réinitialisation du mot de passe.'
              )
          );
        })
      );
  }

  resetPassword(username: string): Observable<any> {
    // Envoyer le username comme corps de la requête (JSON)
    return this.http
      .post<any>(`http://localhost:8082/api/password/forgot`, { username })
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la demande de réinitialisation:',
            error
          );
          return throwError(
            () =>
              new Error(
                error.error?.message || 'Impossible de traiter la demande.'
              )
          );
        })
      );
  }

  getUserInfo(): Observable<AuthModel> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('Token non trouvé'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<AuthModel>(`${this.apiUrl}/user-info`, { headers })
      .pipe(
        catchError((error) => {
          console.error(
            'Erreur lors de la récupération des informations utilisateur:',
            error
          );
          return throwError(
            () => new Error(error.message || 'Une erreur est survenue.')
          );
        })
      );
  }

  validateAccount(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-account`, { token: code });
  }
  decodeToken(token: string): any {
    try {
      return jwtDecode(token); // Nouvelle méthode
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      console.log('Token décodé:', decodedToken);

      if (
        decodedToken &&
        decodedToken.authorities &&
        decodedToken.authorities.length > 0
      ) {
        return decodedToken.authorities[0];
      }
    }
    return null;
  }

  private userId: number | null = null;

  setUserId(userId: number): void {
    this.userId = userId;
    localStorage.setItem('userId', userId.toString());
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.sub) {
        return decodedToken.sub;
      }
    }
    return null;
  }
 
}
