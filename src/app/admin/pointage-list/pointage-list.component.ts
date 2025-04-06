import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { pointage } from 'src/app/models/pointage.model';
import { User } from 'src/app/models/user.model';
import { PointageService } from 'src/app/services/pointage-service.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-pointage-list',
  templateUrl: './pointage-list.component.html',
  styleUrls: ['./pointage-list.component.css'],
})
export class PointageListComponent implements OnInit {
  pointages: pointage[] = [];
  presentUserIds: string[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  PointageStatus: string[] = [];
  today = new Date().toISOString().split('T')[0];

  constructor(
    private pointageService: PointageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.loadPointages();
    this.loadUsers()
    this.loadHolidayStatuses();
  }
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [],
    plugins: [interactionPlugin, dayGridPlugin],
  };
  selecteuserid: any;
  Onselected(event: any) {
    this.selecteuserid = (event.target as HTMLSelectElement).value;
    this.pointageService
      .getPointagesByUser(this.selecteuserid)
      .subscribe((data) => {
        //this.pointages = data;
        this.calendarOptions.events = data.flatMap((pointage) => [
          {
            title: 'Arrivée',
            start: pointage.arrivalTime,
            color: '#00ff00',
          },
          {
            title: 'Départ',
            start: pointage.departureTime,
            color: '#ff0000',
          },
        ]);
      });
    console.log('====================================');
    console.log(this.selecteuserid);
    console.log('====================================');
  }
  loadPointages(): void {
    this.pointageService.getAllPointages().subscribe(
      (data: any) => {
        // Crée un nouveau tableau plutôt que de muter l'existant
        this.pointages = data.map((pointage: any) => {
          // Crée un nouvel objet pour chaque pointage
          return {
            ...pointage, // Conserve toutes les propriétés existantes
            workingTime: this.calculateWorkingTime(pointage),
            status: this.determineStatus(pointage),
          };
        });

        console.log('Pointages chargés:', this.pointages);
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load pointages. Please try again later.';
        this.isLoading = false;
        console.error('Erreur:', error);
      }
    );
  }

  loadHolidayStatuses() {
    this.pointageService.getHolidayStatus().subscribe(
      (statuses) => {
        this.PointageStatus = statuses;
      },
      (error) => {
        console.error('Erreur lors de la récupération des statuts:', error);
      }
    );
  }

  private calculateWorkingTime(pointage: any): string | null {
    if (!pointage.arrivalTime || !pointage.departureTime) {
      return null;
    }

    try {
      const arrival = new Date(pointage.arrivalTime);
      const departure = new Date(pointage.departureTime);
      const diffMs = departure.getTime() - arrival.getTime();

      if (diffMs <= 0) return '0m'; // Affiche 0 minute

      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);

      // Formatage spécial pour les durées < 1 heure
      if (diffHours === 0) {
        return `${diffMinutes}m`; // Affiche seulement les minutes
      }

      return `${diffHours}h${
        diffMinutes % 60 > 0 ? ` ${diffMinutes % 60}m` : ''
      }`;
    } catch (e) {
      console.warn('Erreur dans le calcul du temps de travail', e);
      return null;
    }
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

  determineStatus(pointage: any): string {
    if (pointage.arrivalTime) {
      return 'PRESENT';
    }
    return 'ABSCENT';
  }
  users: any[] = [];
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (err: any) => console.error('Failed to load users:', err),
    });
  }
  deletePointage(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pointageService.deletePointage(id).subscribe({
          next: () => {
            this.pointages = this.pointages.filter((p) => p.id !== id);
            Swal.fire(
              'Deleted!',
              'The attendance record has been deleted.',
              'success'
            );
          },
          error: (err) => {
            Swal.fire('Error!', 'Failed to delete: ' + err.message, 'error');
          },
        });
      }
    });
  }
}
