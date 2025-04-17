import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobOffer } from 'src/app/models/JobOffer.model';
import { JobOffreService } from 'src/app/services/job-offre.service';

@Component({
  selector: 'app-offre',
  templateUrl: './offre.component.html',
  styleUrls: ['./offre.component.css'],
})
export class OffreComponent implements OnInit {
  jobOffers: JobOffer[] = [];
  isLoading = true;
  errorMessage = '';
  jobOfferForm: FormGroup;
  contractstypes: string[] | undefined;

  constructor(
    private jobOffreService: JobOffreService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.jobOfferForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      contractType: ['', Validators.required],
      experienceLevel: ['', Validators.required],
      skillsRequired: [''],
      responsibilities: [''],
      benefits: [''],
      expirationDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadJobOffers();
    this.loadContratctsTypes();
  }

  openAddModal(content: any): void {
    this.modalService.open(content, { size: 'lg' });
  }

  loadJobOffers(): void {
    this.errorMessage = '';
    this.isLoading = true;

    this.jobOffreService.getAllActiveJobOffers().subscribe({
      next: (offers) => {
        this.jobOffers = offers;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des offres d'emploi";
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  deleteJobOffer(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.jobOffreService.deleteJobOffer(id).subscribe({
        next: () => {
          this.jobOffers = this.jobOffers.filter((offer) => offer.id !== id);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur lors de la suppression');
        },
      });
    }
  }

  onSubmit(): void {
    if (this.jobOfferForm.valid) {
      const formValue = this.jobOfferForm.value;
      const newOffer: JobOffer = {
        title: formValue.title,
        description: formValue.description,
        location: formValue.location,
        contractType: formValue.contractType,
        experienceLevel: formValue.experienceLevel,
        publishedDate: new Date().toISOString(),
        expirationDate: formValue.expirationDate,
        isActive: true,
        skillsRequired: formValue.skillsRequired,
        responsibilities: formValue.responsibilities,
        benefits: formValue.benefits,
      };

      this.jobOffreService.createJobOffer(newOffer).subscribe({
        next: (offer) => {
          this.jobOffers.unshift(offer);
          this.modalService.dismissAll();
          this.resetForm();
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la création de l'offre";
          console.error(err);
        },
      });
    }
  }
  private resetForm(): void {
    this.jobOfferForm.reset({
      contractType: 'CDI',
      experienceLevel: 'Junior',
      isActive: true,
    });
  }

  loadContratctsTypes() {
    this.jobOffreService.getContratctsTypes().subscribe(
      (types) => {
        this.contractstypes = types;
      },
      (error) => {
        console.error('Erreur lors de la récupération des statuts:', error);
      }
    );
  }
}