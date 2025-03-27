import { Component, OnInit } from '@angular/core';
import { pointage } from 'src/app/models/pointage.model';
import { PointageService } from 'src/app/services/pointage-service.service';

@Component({
  selector: 'app-pointage-list',
  templateUrl: './pointage-list.component.html',
  styleUrls: ['./pointage-list.component.css'],
})
export class PointageListComponent implements OnInit {
  pointages: pointage[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private pointageService: PointageService) {}

  ngOnInit(): void {
    this.loadPointages();
  }

  loadPointages(): void {
    this.pointageService.getAllPointages().subscribe(
      (data) => {
        this.pointages = data;
        this.pointages.map((a: any) => {
          a.workingTime = this.formatWorkingTime(a.workingTime);
        })
        console.log(data);

        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load pointages. Please try again later.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
  formatWorkingTime(workingTime: string): string {
    if (workingTime.startsWith('PT')) {
      const time = workingTime.slice(2);
      if (time.includes('H')) {
        const hours = time.split('H')[0];
        return `${hours} heures`;
      } else if (time.includes('S')) {
        const seconds = time.split('S')[0];
        return `${seconds} secondes`;
      }
    }
    return workingTime;
  }
}
