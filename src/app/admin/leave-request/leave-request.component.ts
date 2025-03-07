import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '../../models/holiday.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
})
export class LeaveRequestComponent {

  leaveRequests: Holiday[] = []; // Liste des demandes de congé
  holidayStatuses: string[] = []; // Statuts possibles
  selectedRequest: Holiday | null = null; // Demande sélectionnée pour le modal
  newStatus: string = ''; // Nouveau statut sélectionné

  constructor(private holidayService: HolidayService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
    this.loadHolidayStatuses();
  }


  loadLeaveRequests() {
    this.holidayService.getAllHolidays().subscribe(
      (requests) => {
        this.leaveRequests = requests;
        console.log('====================================');
        console.log(requests);
        console.log('====================================');
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des demandes de congé:',
          error
        );
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la récupération des demandes de congé.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  
  loadHolidayStatuses() {
    this.holidayService.getHolidayStatus().subscribe(
      (statuses) => {
        this.holidayStatuses = statuses;
      },
      (error) => {
        console.error('Erreur lors de la récupération des statuts:', error);
      }
    );
  }

  openStatusModal(request: Holiday) {
    this.selectedRequest = request;
    this.newStatus = request.status; 
    const modal = document.getElementById('statusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

 
  closeStatusModal() {
    this.selectedRequest = null;
    this.newStatus = '';
    const modal = document.getElementById('statusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveStatusChange() {
    if (this.selectedRequest && this.newStatus) {
      this.holidayService
        .updateHolidayStatus(this.selectedRequest.id!, this.newStatus)
        .subscribe(
          () => {
           
            const request = this.leaveRequests.find(
              (r) => r.id === this.selectedRequest?.id
            );
            if (request) {
              request.status = this.newStatus;
            }
            this.closeStatusModal();
            Swal.fire({
              title: 'Statut mis à jour avec succès !',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du statut:', error);
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la mise à jour du statut.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
    }
  }


  deleteRequest(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cette action !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.holidayService.deleteHoliday(id).subscribe(
          () => {
            this.loadLeaveRequests();
            Swal.fire({
              title: 'Supprimé !',
              text: 'La demande a été supprimée avec succès.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          (error) => {
            console.error(
              'Erreur lors de la suppression de la demande:',
              error
            );
            Swal.fire({
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression de la demande.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    });
  }
}
