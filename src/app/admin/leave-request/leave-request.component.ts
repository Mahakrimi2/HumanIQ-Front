import { Component, OnInit } from '@angular/core';
import { HolidayService } from '../../services/holiday.service';
import { Holiday } from '../../models/holiday.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
})
export class LeaveRequestComponent implements OnInit {
  leaveRequests: Holiday[] = []; 
  selectedRequest: Holiday | null = null; 

  constructor(private holidayService: HolidayService) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests() {
    this.holidayService.getAllHolidays().subscribe(
      (requests) => {
        this.leaveRequests = requests;
        console.log(requests);
        
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des demandes de congé:',
          error
        );
      }
    );
  }

 
  openModal(request: Holiday) {
    this.selectedRequest = { ...request };
    const modal = document.getElementById('leaveModal');
    if (modal) modal.classList.add('show', 'd-block');
  }


  closeModal() {
    const modal = document.getElementById('leaveModal');
    if (modal) modal.classList.remove('show', 'd-block');
  }

  // Mettre à jour le statut d'une demande

  // updateStatus(newStatus: string) {
  //   if (this.selectedRequest) {
  //     const id = this.selectedRequest.id;
  //     if (newStatus === 'Approved') {
  //       this.holidayService.approveHoliday(id, 'RH Manager').subscribe(
  //         () => {
  //           this.selectedRequest!.status = newStatus;
  //           this.closeModal();
  //           this.loadLeaveRequests(); // Recharger la liste
  //           Swal.fire({
  //             title: 'Demande approuvée avec succès !',
  //             icon: 'success',
  //             draggable: true,
  //             confirmButtonText: 'OK',
  //           });
  //         },
  //         (error) => {
  //           console.error("Erreur lors de l'approbation de la demande:", error);
  //           Swal.fire({
  //             title: 'Erreur',
  //             text: "Une erreur est survenue lors de l'approbation de la demande.",
  //             icon: 'error',
  //             confirmButtonText: 'OK',
  //           });
  //         }
  //       );
  //     } else if (newStatus === 'Rejected') {
  //       this.holidayService.rejectHoliday(id, 'RH Manager').subscribe(
  //         () => {
  //           this.selectedRequest!.status = newStatus;
  //           this.closeModal();
  //           this.loadLeaveRequests(); // Recharger la liste
  //           Swal.fire({
  //             title: 'Demande rejetée avec succès !',
  //             icon: 'success',
  //             draggable: true,
  //             confirmButtonText: 'OK',
  //           });
  //         },
  //         (error) => {
  //           console.error('Erreur lors du rejet de la demande:', error);
  //           Swal.fire({
  //             title: 'Erreur',
  //             text: 'Une erreur est survenue lors du rejet de la demande.',
  //             icon: 'error',
  //             confirmButtonText: 'OK',
  //           });
  //         }
  //       );
  //     } else if (newStatus === 'Pending') {
  //       // Implémentez une méthode pour mettre à jour le statut en "Pending" si nécessaire
  //     }
  //   }
  // }

  // Supprimer une demande de congé
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
            this.loadLeaveRequests(); // Recharger la liste
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
