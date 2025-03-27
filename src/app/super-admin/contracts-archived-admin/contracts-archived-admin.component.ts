import { Component, OnInit } from '@angular/core';
import { Contract } from 'src/app/models/contract.model';
import { ContractService } from 'src/app/services/contract.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contracts-archived-admin',
  templateUrl: './contracts-archived-admin.component.html',
  styleUrls: ['./contracts-archived-admin.component.css']
})
export class ContractsArchivedAdminComponent implements OnInit {
  archivedContrats: Contract[] = [];

  constructor(private contractService: ContractService,private expPDF:ExportPdfService) {}

  ngOnInit(): void {
    this.loadArchivedContrats();
  }

  loadArchivedContrats(): void {
    this.contractService.getArchivedContracts().subscribe(
      (archivedContrats) => {
        this.archivedContrats = archivedContrats;
        console.log('====================================');
        console.log(archivedContrats);
        console.log('====================================');
      },
      (error) => {
        console.error(
          'Erreur lors du chargement des contrats archivés :',
          error
        );
      }
    );
  }

  restoreContrat(id: number): void {
    this.contractService.restoreContrat(id).subscribe(
      () => {
        Swal.fire(
          'Restauré!',
          'Le contrat a été restauré avec succès.',
          'success'
        );
        this.loadArchivedContrats(); // Recharger la liste des contrats archivés
      },
      (error) => {
        console.error('Erreur lors de la restauration du contrat :', error);
        Swal.fire(
          'Erreur !',
          'Une erreur est survenue lors de la restauration du contrat.',
          'error'
        );
      }
    );
  }

  downloadContract(contractId: number): void {
    this.expPDF.downloadContractPdf(contractId);
  }
}
