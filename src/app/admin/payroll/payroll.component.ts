import { Component, OnInit } from '@angular/core';
import saveAs from 'file-saver';
import { catchError, of } from 'rxjs';
import { Payslip } from 'src/app/models/Payslip.model';
import { User } from 'src/app/models/user.model';
import { PayslipService } from 'src/app/services/payslip.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.css'],
})
export class PayrollComponent implements OnInit {
  payslips: Payslip[] = [];
  users: User[] = [];
  loading = false;
  loadingUsers = false;
  currentPage = 1;
  itemsPerPage = 5;
  selectedUserId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private payslipService: PayslipService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.userService
      .getAllUsers()
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Erreur lors du chargement des utilisateurs';
          console.error(error);
          return of([]);
        })
      )
      .subscribe((users) => {
        this.users = users;
        this.loadingUsers = false;
        // Charger toutes les fiches si aucun utilisateur n'est sélectionné
        this.loadPayslips(this.selectedUserId);
      });
  }

  loadPayslips(userId: number | null): void {
    this.loading = true;
    this.payslips = [];
    this.errorMessage = null;

    const observable = userId
      ? this.payslipService.getPayslipsByUserId(userId)
      : this.payslipService.getAllPayslips();

    observable
      .pipe(
        catchError((error) => {
          this.errorMessage = 'Erreur lors du chargement des fiches de paie';
          console.error(error);
          return of([]);
        })
      )
      .subscribe((payslips: Payslip[]) => {
        this.payslips = payslips;
        this.loading = false;
        this.currentPage = 1; // Reset à la première page
      });
  }

  onUserSelect(userId: string): void {
    this.selectedUserId = userId ? parseInt(userId) : null;
    this.loadPayslips(this.selectedUserId);
  }

  get paginatedPayslips(): Payslip[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.payslips.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.payslips.length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  downloadPayslip(id: number, filename: string | null): void {
    if (!filename) {
      Swal.fire('Error', 'Missing filename', 'error');
      return;
    }

    this.payslipService.downloadPayslipforRHAdmin(id).subscribe({
      next: (blob) => saveAs(blob, filename),
      
    });
  }
  deletePayslip(id: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer cette fiche de paie ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.payslipService.deletePayslip(id).subscribe({
          next: () => {
            this.payslips = this.payslips.filter((p) => p.id !== id);
            Swal.fire('Supprimé!', 'La fiche a été supprimée.', 'success');

            // Revenir à la page précédente si la page actuelle est vide
            if (this.paginatedPayslips.length === 0 && this.currentPage > 1) {
              this.currentPage--;
            }
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Erreur', 'Échec de la suppression', 'error');
          },
        });
      }
    });
  }

  getMonthFromFilename(filename: string | null): string {
    if (!filename) return 'Inconnu';

    try {
      const monthNumber = filename.split('_')[1].split('.')[0];
      const date = new Date();
      date.setMonth(Number(monthNumber) - 1);
      return date.toLocaleString('default', { month: 'long' });
    } catch (error) {
      console.error('Erreur extraction mois:', error);
      return 'Inconnu';
    }
  }
}