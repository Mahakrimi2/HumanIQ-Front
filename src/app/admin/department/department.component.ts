import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent {
  addDepartment() {
    throw new Error('Method not implemented.');
  }
  departments = [
    {
      name: 'Human Resources',
      head: 'Alice Johnson',
      phone: '123-456-7890',
      email: 'alice@company.com',
      capacity: 30,
      establishedYear: 2005,
      totalEmployees: 25,
    },
    {
      name: 'IT',
      head: 'Bob Smith',
      phone: '987-654-3210',
      email: 'bob@company.com',
      capacity: 50,
      establishedYear: 2010,
      totalEmployees: 45,
    },
    {
      name: 'Sales',
      head: 'Charlie Brown',
      phone: '555-123-4567',
      email: 'charlie@company.com',
      capacity: 40,
      establishedYear: 2012,
      totalEmployees: 38,
    },
  ];

  selectedDepartment: any = null;

  openModal(department: any) {
    this.selectedDepartment = { ...department };
    const modal = document.getElementById('departmentModal');
    if (modal) modal.classList.add('show', 'd-block');
  }

  closeModal() {
    const modal = document.getElementById('departmentModal');
    if (modal) modal.classList.remove('show', 'd-block');
  }

  deleteDepartment(name: string) {
    // Logic to delete department
    Swal.fire({
      title: 'Deleted successfully!',
      icon: 'success',
      draggable: true, // Enable dragging
      confirmButtonText: 'OK',
    });
  }
 
}