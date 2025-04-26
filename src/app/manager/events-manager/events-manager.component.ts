import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from 'src/app/services/events.service';
import { Event } from "src/app/models/event.model";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-events-manager',
  templateUrl: './events-manager.component.html',
  styleUrls: ['./events-manager.component.css'],
})
export class EventsManagerComponent implements OnInit {
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
      const eventData: any = {
        title: formData.title,
        startDateTime: new Date(formData.startDateTime).toISOString(),
        endDateTime: formData.endDateTime
          ? new Date(formData.endDateTime).toISOString()
          : undefined,
        description: formData.description,
        location: formData.location,
        type: formData.type,
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (newEvent: any) => {
          this.events.unshift(newEvent);
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error creating event', err);
        },
      });
    }
  }
  deleteEvent(eventId: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(eventId).subscribe(
          () => {
            this.events = this.events.filter((event) => event.id !== eventId);
            // Message de succès
            Swal.fire('Supprimé !', "L'événement a été supprimé.", 'success');
          },
          (error) => {
            console.error(
              "Erreur lors de la suppression de l'événement",
              error
            );
            Swal.fire(
              'Erreur !',
              "Impossible de supprimer l'événement.",
              'error'
            );
          }
        );
      }
    });
  }
}
