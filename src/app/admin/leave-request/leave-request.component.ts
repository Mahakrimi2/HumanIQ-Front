import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
})
export class LeaveRequestComponent {
  deleteRequest() {
    throw new Error('Method not implemented.');
  }
  deleteUser() {
   Swal.fire({
         title: 'Delete it successufuly!',
         icon: 'success',
         draggable: true, // Enable dragging
         confirmButtonText: 'OK',
       });
     }
  
  leaveRequests = [
    {
      id: 'EMP001',
      name: 'John Doe',
      department: 'IT',
      leaveType: 'Annual Leave',
      leaveFrom: '2025/02/10',
      leaveTo: '2025/02/15',
      days: 5,
      reason: 'Vacation',
      requestedOn: '2025/02/05',
      approvedBy: 'Jane Smith',
      approvalOn: '2025/02/07',
      status: 'Pending',
    },
  ];

  selectedRequest: any = null;

  openModal(request: any) {
    this.selectedRequest = { ...request };
    const modal = document.getElementById('leaveModal');
    if (modal) modal.classList.add('show', 'd-block');
  }

  closeModal() {
    const modal = document.getElementById('leaveModal');
    if (modal) modal.classList.remove('show', 'd-block');
  }

  updateStatus(newStatus: string) {
    if (this.selectedRequest) {
      this.selectedRequest.status = newStatus;
      const request = this.leaveRequests.find(
        (req) => req.id === this.selectedRequest.id
      );
      if (request) request.status = newStatus;
    }
    this.closeModal();
  }
}
