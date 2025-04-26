import { Component,Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { pointage } from 'src/app/models/pointage.model';
import { AuthService } from 'src/app/services/auth.service';
import { PointageService } from 'src/app/services/pointage-service.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventsService } from 'src/app/services/events.service';
import { Event } from 'src/app/models/event.model';
@Component({
  selector: 'app-calendar-manager',
  templateUrl: './calendar-manager.component.html',
  styleUrls: ['./calendar-manager.component.css'],
})
export class CalendarManagerComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [],
    plugins: [interactionPlugin, dayGridPlugin],
    dayCellDidMount: (info) => {
      const day = info.date.getDay(); // 0 = Dimanche, 6 = Samedi
      if (day === 0 || day === 6) {
        info.el.style.backgroundColor = '#f0f0f0'; // Colorier weekends
      }
    },
    eventClick: this.handleEventClick.bind(this),
  };

  selectedEvent: any = null; // Stocke l'event cliqué
  isModalOpen: boolean = false; // Contrôle affichage du modal

  constructor(
    private pointageService: PointageService,
    private authService: AuthService,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const username = this.authService.getUsername();
    const allEvents: any[] = [];

    // Charger les pointages
    this.pointageService.getPointagesByUser(username!).subscribe(
      (pointages: pointage[]) => {
        const pointageEvents = pointages.flatMap((pointage) => [
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

        allEvents.push(...pointageEvents);

        // Charger les événements après
        this.eventService.getEvents().subscribe(
          (events: any[]) => {
            const calendarEvents = events.map((event) => ({
              title: event.title,
              start: event.startDateTime,
              end: event.endDateTime,
              description: event.description || '',
              color: '#3788d8',
            }));

            allEvents.push(...calendarEvents);

            // Mise à jour une seule fois
            this.calendarOptions.events = allEvents;
          },
          (error) => {
            console.error('Erreur lors du chargement des événements:', error);
          }
        );
      },
      (error) => {
        console.error('Erreur lors du chargement des pointages:', error);
      }
    );
  }

  handleEventClick(clickInfo: any): void {
    this.selectedEvent = {
      title: clickInfo.event.title,
      start: clickInfo.event.startDateTime,
      end: clickInfo.event.endDateTime,
      description: clickInfo.event.extendedProps.description || '',
      location: clickInfo.event.extendedProps?.location || '',
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}