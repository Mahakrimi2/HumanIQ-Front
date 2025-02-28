import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class CalenderComponent implements OnInit {
  @Input() calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    events: [], // events peuvent être un tableau ou une autre source
  };

  ngOnInit() {
    // Évite de réaffecter la même propriété et effectue une vérification plus légère
    if (
      Array.isArray(this.calendarOptions.events) &&
      this.calendarOptions.events.length === 0
    ) {
      this.calendarOptions.events = [{ title: 'Event 1', date: '2025-02-14' }];
    }
  }
}
