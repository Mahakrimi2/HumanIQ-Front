import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CV } from 'src/app/models/CV.model';
import { CvServiceService } from 'src/app/services/cv-service.service';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent implements OnInit {
  @Input() jobOfferId!: number;
  selectedFile: File | null = null;
  uploadProgress: number | null = null;
  uploadSuccess = false;
  uploadError = false;
  cvs: CV[] = [];
  name: string = '';
  email: string = '';
  mobile: string = '';
  skills: string = '';
  expandedCVs: Set<number> = new Set();

  constructor(private cvService: CvServiceService) {}

  ngOnInit(): void {
    this.loadCVs();
  }

  getParsedSkills(cv: CV): string[] {
    try {
      return JSON.parse(cv.skills || '[]');
    } catch {
      return [];
    }
  }

  toggleExpanded(cvId: number): void {
    if (this.expandedCVs.has(cvId)) {
      this.expandedCVs.delete(cvId);
    } else {
      this.expandedCVs.add(cvId);
    }
  }

  isExpanded(cvId: number): boolean {
    return this.expandedCVs.has(cvId);
  }

  loadCVs(): void {
    this.cvService.loadCVs().subscribe({
      next: (data) => {
        this.cvs = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      },
      error: (err) => {
        console.error('Error loading CVs:', err);
      },
    });
  }
 

  getFirstInitial(fullname: string): string {
    if (!fullname) return '?';
    // Gère les noms composés en prenant la première lettre de chaque partie
    const initials = fullname
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
    return initials.length > 2 ? initials.substring(0, 2) : initials || '?';
  }

  getAvatarColor(fullname: string): string {
    const colors = [
      '#2c3e50',
      '#34495e',
      '#1a237e',
      '#0d47a1',
      '#263238',
      '#212121',
      '#311b92',
      '#4a148c',
    ];
    const charCode =
      fullname?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[charCode % colors.length];
  }

  // onFileSelected(event: any): void {
  //   this.selectedFile = event.target.files[0];
  //   this.uploadProgress = null;
  //   this.uploadSuccess = false;
  //   this.uploadError = false;
  // }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  upload(): void {
    if (this.selectedFile) {
      this.cvService.uploadCV(this.selectedFile).subscribe({
        next: () => {
          this.uploadSuccess = true;
          this.uploadError = false;
          this.loadCVs();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Erreur upload:', err);
          this.uploadSuccess = false;
          this.uploadError = true;
        },
      });
    }
  }

  // onUpload(): void {
  //   if (this.selectedFile) {
  //     this.uploadProgress = 0;
  //     this.uploadError = false;

  //     let formData = new FormData();
  //     formData.append('file', this.selectedFile, this.selectedFile.name);

  //     this.cvService.uploadCV(formData).subscribe({
  //       next: (event) => {
  //         if (event.type === 1 && event.loaded && event.total) {
  //           // Upload progress
  //           this.uploadProgress = Math.round(
  //             (100 * event.loaded) / event.total
  //           );
  //         } else if (event.type === 4) {

  //           this.uploadSuccess = true;
  //           this.uploadProgress = null;
  //           this.selectedFile = null;
  //           this.loadCVs();
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Upload error:', err);
  //         this.uploadError = true;
  //         this.uploadProgress = null;
  //       },
  //     });
  //   }
  // }

  downloadCV(cvId: number, fileName: string): void {
    this.cvService.downloadCV(cvId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'cv.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  deleteCV(cvId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce CV ?')) {
      this.cvService.deleteCV(cvId).subscribe({
        next: () => {
          this.cvs = this.cvs.filter((cv) => cv.id !== cvId);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression');
        },
      });
    }
  }
}
