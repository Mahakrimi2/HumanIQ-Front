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

  constructor(private cvService: CvServiceService) {}

  ngOnInit(): void {
    this.loadCVs();
  
  }

  loadCVs(): void {
 
      this.cvService.getCVsByJobOffer().subscribe({
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = null;
    this.uploadSuccess = false;
    this.uploadError = false;
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.uploadProgress = 0;
      this.uploadError = false;

      this.cvService.uploadCV(this.selectedFile).subscribe({
        next: (event) => {
          if (event.type === 1 && event.loaded && event.total) {
            // Upload progress
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === 4) {
           
            this.uploadSuccess = true;
            this.uploadProgress = null;
            this.selectedFile = null;
            this.loadCVs();
          }
        },
        error: (err) => {
          console.error('Upload error:', err);
          this.uploadError = true;
          this.uploadProgress = null;
        },
      });
    }
  }

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
}
