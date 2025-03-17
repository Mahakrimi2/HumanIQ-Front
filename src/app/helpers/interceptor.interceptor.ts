// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, finalize } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private totalRequests = 0;

//   // Liste des URL publiques qui ne nécessitent pas d'authentification
//   private publicUrls: string[] = [
//     '/api/auth/register',
//     '/api/auth/login',
//     // Ajoutez d'autres URL publiques si nécessaire
//   ];

//   constructor(private router: Router) {}

//   intercept(
//     request: HttpRequest<unknown>,
//     next: HttpHandler
//   ): Observable<HttpEvent<unknown>> {
//     this.totalRequests++;
//     this.showLoader();

//     const token = localStorage.getItem('token');
//     console.log('Token récupéré:', token);

//     // Vérifier si l'URL de la requête est publique
//     const isPublicUrl = this.publicUrls.some((url) =>
//       request.url.includes(url)
//     );

//     // Ajouter l'en-tête Authorization uniquement si l'URL n'est pas publique et que le token est présent
//     if (token && !isPublicUrl) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     }
//     console.log('Headers envoyés:', request.headers.get('Authorization'));

//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401) {
//           console.warn(
//             'Erreur 401 détectée, suppression du token et redirection.'
//           );
//           localStorage.removeItem('token');
//           this.router.navigate(['/auth/login']);
//         }
//         return throwError(
//           () => new Error(error.error?.message || 'Une erreur est survenue.')
//         );
//       }),
//       finalize(() => {
//         this.totalRequests--;
//         if (this.totalRequests === 0) {
//           this.hideLoader();
//         }
//       })
//     );
//   }

//   private showLoader(): void {
//     document.body.classList.add('loading');
//   }

//   private hideLoader(): void {
//     document.body.classList.remove('loading');
//   }
// }
