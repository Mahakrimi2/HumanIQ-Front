import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { Event } from 'src/app/models/event.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  events: Event[] = [];
  

  eventForm: FormGroup;
  showModal = false;

  constructor(private eventService: EventsService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      startDateTime: ['', Validators.required],
      endDateTime: [''],
      description: [''],
      location: ['', Validators.required],
      type: ['IN_PERSON', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  openCreateEventModal(): void {
   
    this.showModal = true;
       event?.stopPropagation();
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(
      (events: any[]) => {
        this.events = events;
      
      },
      (err: any) => {
        console.error('Error loading events', err);
       
      }
    );
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      const eventData: any = {  // Changed type to CalendarEvent
        title: formData.title,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: formData.endDateTime
          ? new Date(formData.endDateTime).toISOString()
          : undefined,
        description: formData.description,
        location: formData.location,
        type: formData.type
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (newEvent: any) => {  // Updated type
          this.events.unshift(newEvent);
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error creating event', err);
        }
      });
    }
  }
}
