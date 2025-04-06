import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TrelloService {
  readonly apiKey = 'a6b8a2150a5b1119523a238061228018';
  readonly apiUrl = 'https://api.trello.com/1';
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.extractTokenFromUrl();
    this.token = localStorage.getItem('trello_token');
  }

  /**
   * Set the token in memory and localStorage.
   * @param token The token to set.
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('trello_token', token);
  }

  /**
   * Get the token from memory or localStorage.
   * @returns The token or null if not found.
   */
  getToken(): string | null {
    if (this.token) {
      return this.token;
    }
    this.token = localStorage.getItem('trello_token');
    return this.token;
  }

  /**
   * Check if the user is authenticated.
   * @returns true if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get all boards of the authenticated user.
   * @returns An observable of the user's boards.
   */
  getBoards(): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('Token Trello manquant. Veuillez vous authentifier.')
      );
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('token', token.trim());
    return this.http
      .get<any[]>(`${this.apiUrl}/members/me/boards`, {
        params: params,
      })
      .pipe(
        map((boards) => boards || []),
        catchError((error) => {
          console.error('Erreur lors de la récupération des boards:', error);
          return throwError(
            () => new Error('Impossible de récupérer les boards Trello.')
          );
        })
      );
  }

  /**
   * Get the lists of a specific board.
   * @param boardId The ID of the board.
   * @returns An observable of the lists on the board.
   */
  getBoardLists(boardId: string): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('Token Trello manquant. Veuillez vous authentifier.')
      );
    }

    const params = new HttpParams().set('token', token.trim());
    return this.http
      .get<any[]>(`${this.apiUrl}/boards/${boardId}/lists`, {
        params: params,
      })
      .pipe(
        map((lists) => lists || []),
        catchError((error) => {
          console.error('Erreur lors de la récupération des listes:', error);
          return throwError(
            () => new Error('Impossible de récupérer les listes du board.')
          );
        })
      );
  }

  /**
   * Create a new board.
   * @param boardName The name of the board to create.
   * @returns An observable of the created board.
   */
  createBoard(boardName: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('Token Trello manquant. Veuillez vous authentifier.')
      );
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('token', token.trim()) // Nettoie le token
      .set('name', boardName);

    return this.http.post<any>(`${this.apiUrl}/boards/`, {}, { params }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du board:', error);
        return throwError(() => new Error('Impossible de créer le board.'));
      })
    );
  }

  /**
   * Extract the token from the URL after authentication.
   * This method should be called after redirection back to your app.
   */
  redirectToAuthPage(): void {
    const authUrl = `https://trello.com/1/authorize?response_type=token&key=${this.apiKey}&scope=read,write&expiration=never&name=YourAppName&return_url=${window.location.origin}`;
    window.location.href = authUrl;
  }

  /**
   * Extrait le token depuis l'URL après authentification.
   */
  extractTokenFromUrl(): void {
    const urlParams = new URLSearchParams(
      window.location.hash.replace('#', '?')
    );
    const token = urlParams.get('token');
    if (token) {
      this.setToken(token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }
  /**
   * Ajoute un membre à un board Trello
   * @param boardId ID du board Trello
   * @param email Email du membre à ajouter
   * @param type Type d'accès ('normal', 'admin', 'observer')
   * @returns Un observable du résultat de l'ajout
   */
  addMemberToBoard(
    boardId: string,
    username: string,
    type: 'normal' | 'admin' | 'observer' = 'normal'
  ): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(
        () => new Error('Token Trello manquant. Veuillez vous authentifier.')
      );
    }

    // Vérifiez que l'email est valide


    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('token', token.trim())
      .set('email', username)
      .set('type', type);

    return this.http
      .put<any>(`${this.apiUrl}/boards/${boardId}/members`, {}, { params })
      .pipe(
        catchError((error) => {
          console.error("Erreur lors de l'ajout du membre:", error);
          if (error.status === 403) {
            return throwError(
              () =>
                new Error(
                  `Permission refusée. Vérifiez que : 
          1. Votre token a les bonnes permissions
          2. L'email ${username} existe dans Trello
          3. Vous êtes admin du board`
                )
            );
          }
          return throwError(
            () => new Error("Impossible d'ajouter le membre au board.")
          );
        })
      );
  }
  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  deleteBoard(boardId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Token Trello manquant'));
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('token', token.trim());

    return this.http.delete<any>(`${this.apiUrl}/boards/${boardId}`, { params }).pipe(
      catchError(error => {
        console.error('Erreur suppression board:', error);
        return throwError(() => new Error('Échec de la suppression du board'));
      })
    );
  }
}