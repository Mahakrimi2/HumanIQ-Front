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

  selectedUserId: string | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  constructor(
    private pointageService: PointageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // this.loadPointages();
    this.loadUsers();
    this.loadHolidayStatuses();
  }
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [],
    plugins: [interactionPlugin, dayGridPlugin],
    eventDisplay: 'block',
    validRange: {
      start: new Date(new Date().setDate(new Date().getDate() - 90)),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
    },
    height: 'auto', // Ajuster la hauteur automatiquement
    eventOverlap: false,
  };
  selecteuserid: any;

  // Onselected(event: any) {
  //   this.selecteuserid = (event.target as HTMLSelectElement).value;
  //   this.pointageService
  //     .getPointagesByUser(this.selecteuserid)
  //     .subscribe((data) => {
  //       //this.pointages = data;
  //       this.calendarOptions.events = data.flatMap((pointage) => [

  //         {
  //           title: 'Arrivée',
  //           start: pointage.arrivalTime,
  //           color: '#00ff00',
  //         },
  //         {
  //           title: 'Départ',
  //           start: pointage.departureTime,
  //           color: '#ff0000',
  //         },
  //       ]);
  //       const absentEvents = this.getAbsentDays(data);
  //     });
  //   // Ajouter les jours sans pointage comme "Absent"

  //   console.log('====================================');
  //   console.log(this.selecteuserid);
  //   console.log('====================================');
  // }
  Onselected(event: any) {
    this.selecteuserid = (event.target as HTMLSelectElement).value;
    console.log('Utilisateur sélectionné:', this.selecteuserid);

    this.pointageService.getPointagesByUser(this.selecteuserid).subscribe({
      next: (pointages) => {
        console.log('Pointages reçus:', pointages);

        const pointageEvents = pointages.flatMap((p, index) => {
          const events = [];
          if (p.arrivalTime && !isNaN(new Date(p.arrivalTime).getTime())) {
            events.push({
              id: `arrival-${index}`,
              title: `Arrivée: ${new Date(p.arrivalTime).toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit' }
              )}`,
              start: new Date(p.arrivalTime),
              color: '#28a745',
              allDay: false,
              display: 'block',
            });
          } else {
            console.warn(`Pointage invalide (arrivalTime) pour pointage:`, p);
          }
          if (p.departureTime && !isNaN(new Date(p.departureTime).getTime())) {
            events.push({
              id: `departure-${index}`,
              title: `Départ: ${new Date(p.departureTime).toLocaleTimeString(
                [],
                { hour: '2-digit', minute: '2-digit' }
              )}`,
              start: new Date(p.departureTime),
              color: '#dc3545',
              allDay: false,
              display: 'block',
            });
          } else {
            console.warn(`Pointage invalide (departureTime) pour pointage:`, p);
          }
          return events;
        });

        console.log('Événements de pointage générés:', pointageEvents);

        // 2. Obtenir les jours absents
        const absentEvents = this.getAbsentDays(pointages);
        console.log("Événements d'absence générés:", absentEvents);

        // 3. Mettre à jour les options du calendrier
        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...pointageEvents, ...absentEvents],
          eventDisplay: 'block',
          validRange: {
            start: new Date(new Date().setDate(new Date().getDate() - 90)),
            end: new Date(new Date().setDate(new Date().getDate() + 2)),
          },
        };

        console.log(
          'Options du calendrier mises à jour:',
          this.calendarOptions
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des pointages:', err);
      },
    });
  }
  private getAbsentDays(pointages: pointage[]): any[] {
    const absentDays: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Aujourd'hui : 24 mai 2025

    // 1. Extraire les dates de pointage valides
    const pointageDates = pointages
      .filter((p) => p.arrivalTime && !isNaN(new Date(p.arrivalTime).getTime()))
      .map((p) => new Date(p.arrivalTime).toISOString().split('T')[0])
      .filter((date) => date !== null);

    console.log('Dates de pointage valides:', pointageDates);

    // 2. Définir la période à vérifier (90 jours pour couvrir plusieurs mois, incluant aujourd'hui)
    const daysToCheck = 90;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToCheck + 1); // Commencer 90 jours avant aujourd'hui

    // 3. Parcourir chaque jour de la période jusqu'à aujourd'hui
    for (let i = 0; i <= daysToCheck; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      const dayOfWeek = checkDate.getDay();

      // 4. Ignorer les jours futurs (après aujourd'hui)
      if (checkDate > today && i > 0) {
        console.log(`Date ${dateStr}: Ignorée (futur)`);
        break; // Arrêter après aujourd'hui
      }

      // 5. Identifier les weekends (samedi = 6, dimanche = 0)
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        // Samedi (6) ou dimanche (0)
        absentDays.push({
          id: `weekend-${dateStr}`, // ID unique
          title: 'Weekend',
          start: dateStr,
          color: '#6c757d',
          allDay: true,
          display: 'background',
        });
        console.log(`Date ${dateStr}: Weekend (jour ${dayOfWeek})`);
        continue;
      }

      // 6. Vérifier si la date a un pointage
      const hasPointage = pointageDates.includes(dateStr);

      // 7. Ajouter un événement "Absent" si aucun pointage
      if (!hasPointage) {
        absentDays.push({
          id: `absent-${dateStr}`, // ID unique
          title: 'Absent',
          start: dateStr,
          color: '#ffcc00',
          allDay: true,
          display: 'background',
          classNames: ['fc-event-absent'],
        });
        console.log(`Date ${dateStr}: Absent (jour ${dayOfWeek})`);
      } else {
        console.log(`Date ${dateStr}: Présent (jour ${dayOfWeek})`);
      }
    }

    console.log("Événements d'absence générés:", absentDays);
    return absentDays;
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
