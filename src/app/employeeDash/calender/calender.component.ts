import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';  
import { PointageService } from 'src/app/services/pointage-service.service';
import { pointage } from 'src/app/models/pointage.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})

export class CalenderComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    events: [], 
    plugins: [interactionPlugin, dayGridPlugin],
  };

  constructor(
    private pointageService: PointageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPointages();
  }

  loadPointages(): void {
    const username = this.authService.getUsername();
    this.pointageService.getPointagesByUser(username!).subscribe(
      (data: pointage[]) => {
        console.log(data);
        
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
      },
      (error) => {
        console.error('Erreur lors du chargement des pointages:', error);
      }
    );
  }
}
