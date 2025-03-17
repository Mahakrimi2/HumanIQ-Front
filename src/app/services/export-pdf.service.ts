import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportPdfService {
  private apiUrl = 'http://localhost:8082/api/pdf';

  constructor(private http: HttpClient) {}

  downloadPdf(contratId: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/${contratId}`, {
      responseType: 'blob',
      headers,
    });
  }
  downloadContractPdf(contractId: number): void {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    this.http
      .get(`${this.apiUrl}/${contractId}/print`, { responseType: 'blob',headers:headers })
      .subscribe(
        (response) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `contract_${contractId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Erreur lors du téléchargement du contrat :', error);
        }
      );
  }
}
