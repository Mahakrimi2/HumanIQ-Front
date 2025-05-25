import { Component, OnInit } from '@angular/core';
import saveAs from 'file-saver';
import { PayslipService } from 'src/app/services/payslip.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payslip-list',
  templateUrl: './payslip-list.component.html',
  styleUrls: ['./payslip-list.component.css'],
})
export class PayslipListComponent implements OnInit {
  payslips: any[] = [];
  loading = false;

  constructor(private payslipService: PayslipService) {}

  ngOnInit(): void {
    this.loadPayslips();
  }
  currentDate = new Date();

  refreshPayslips(): void {
    this.loading = true;
    this.loadPayslips();
  }
  loadPayslips(): void {
    this.loading = true;
    this.payslipService.getMyPayslips().subscribe(
      (data) => {
        this.payslips = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        this.loading = false;
      },
      (error) => {
        console.error('Error loading payslips', error);
        this.loading = false;
      }
    );
  }

  downloadPayslip(id: number, filename: string): void {
    this.payslipService.downloadPayslip(id).subscribe(
      (blob) => {
        saveAs(blob, filename);
      },
      (error) => {
        console.error('Error downloading payslip', error);
      }
    );
  }


  
  getMonthFromFilename(filename: string): string {
    const monthNumber = filename.split('_')[1].split('.')[0];
    const date = new Date();
    date.setMonth(Number(monthNumber) - 1);
    return date.toLocaleString('default', { month: 'long' });
  }
  deletePayslip(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cette suppression !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.payslipService.deletePayslip(id).subscribe({
          next: () => {
            this.payslips = this.payslips.filter((p) => p.id !== id);
            Swal.fire(
              'Supprimé !',
              'La fiche de paie a été supprimée.',
              'success'
            );
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Erreur !',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          },
        });
      }
    });
  }
}
