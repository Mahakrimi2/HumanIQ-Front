import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/company.model';
import { CompanyServiceService } from 'src/app/services/company-service.service';

@Component({
  selector: 'app-company-admin',
  templateUrl: './company-admin.component.html',
  styleUrls: ['./company-admin.component.css'],
})
export class CompanyAdminComponent implements OnInit {
  errorMessage: string | undefined;
  companyInfo: Company = {
    name: '',
    mission: '',
    description: '',
    vision: '',
    values: '',
    foundedYear: 0,
    location: '',
    website: '',
    policies: '',
  };

  isModalOpen: boolean = false;

  constructor(private companyService: CompanyServiceService) {}

  ngOnInit(): void {
    this.loadCompanyInfo();
  }

  loadCompanyInfo(): void {
    this.companyService.getCompany().subscribe(
      (data) => {
        this.companyInfo = data; // Assignation des données de l'entreprise
      },
      (error) => {
        this.errorMessage = error; // Gestion de l'erreur
      }
    );
  }

  openEditModal(): void {
    console.log('Edit modal opened', this.isModalOpen); // Vérifiez l'état de isModalOpen
    this.isModalOpen = true;
  }
  closeModal(): void {
    this.isModalOpen = false;
  }

  submitEdit(): void {
    if (
      !this.companyInfo?.name ||
      !this.companyInfo?.mission ||
      !this.companyInfo?.description ||
      !this.companyInfo?.vision ||
      !this.companyInfo?.values ||
      !this.companyInfo?.foundedYear ||
      !this.companyInfo?.location ||
      !this.companyInfo?.website ||
      !this.companyInfo?.policies
    ) {
      // Valider que tous les champs sont remplis
      alert('Tous les champs doivent être remplis!');
      return;
    }

    // Appel pour mettre à jour les informations de l'entreprise
    this.companyService.updateCompany(this.companyInfo).subscribe(
      (response) => {
        alert(
          "Les informations de l'entreprise ont été mises à jour avec succès!"
        );
        this.closeModal();
      },
      (error) => {
        alert(
          'Une erreur est survenue lors de la mise à jour des informations.'
        );
      }
    );
  }
}
