import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
})
export class PayrollComponent {

  payrolls = [
    {
      employeeName: 'Alice Johnson',
      email: 'alice@example.com',
      department: 'Finance',
      salary: 6000,
      bonus: 300,
      deductions: 150,
      netSalary: 6150,
    },
    {
      employeeName: 'Bob Williams',
      email: 'bob@example.com',
      department: 'Marketing',
      salary: 5500,
      bonus: 400,
      deductions: 200,
      netSalary: 5700,
    },
    {
      employeeName: 'Charlie Brown',
      email: 'charlie@example.com',
      department: 'IT',
      salary: 7000,
      bonus: 500,
      deductions: 250,
      netSalary: 7250,
    },
  ];

  openModal() {
    const modalElement = document.getElementById('editPayrollModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal() {
 
    const modalElement = document.getElementById('editPayrollModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
  }


  deletePayroll() {
    Swal.fire({
      title: 'Deleted successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }
}