import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Contract } from 'src/app/models/contract.model';
import { User } from 'src/app/models/user.model';
import { ContractService } from 'src/app/services/contract.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contracts-list-admin',
  templateUrl: './contracts-list-admin.component.html',
  styleUrls: ['./contracts-list-admin.component.css'],
})
export class ContractsListAdminComponent implements OnInit {
  filteredContracts: Contract[] = [];
  searchText: string = '';
  fullBenefits: string = '';
  isBenefitsModalOpen: boolean = false;
  filterContracts(event: any): void {
    const searchText = event.target.value.toLowerCase().trim(); // Récupérer le texte de recherche
    console.log('Search Text:', searchText);

    if (!searchText) {
      // Si le champ de recherche est vide, afficher tous les contrats
      this.filteredContracts = [...this.contracts];
    } else {
      // Filtrer les contrats en fonction du texte de recherche
      this.filteredContracts = this.contracts.filter((contract) => {
        const contractType = contract.contractType
          ? contract.contractType.toLowerCase()
          : '';
        const status = contract.status ? contract.status.toLowerCase() : '';
        return contractType.includes(searchText) || status.includes(searchText);
      });
    }
  }

  selectedContract: Contract | null = null;
  addContract: any;

  loadContractForEdit(_t32: Contract) {
    console.log(_t32);

    this.editContractForm.patchValue(_t32);
  }

  contracts: Contract[] = [];
  users: User[] = [];
  newContract: any = {
    contractType: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    workingHours: 0,
    benefits: '',
    salary: 0,
    signed: false,
    status: 'active',
    archived: false,
  };

  iduser: any;
  editContractForm!: FormGroup<any>;

  constructor(
    private contractService: ContractService,
    private modalService: NgbModal,
    private userService: UserService,
    private expdfService: ExportPdfService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadUsers();
    this.initEditForm();
  }

  loadContracts() {
    this.contractService.getAllContractsbystatus().subscribe(
      (response: Contract[]) => {
        this.contracts = response;
        this.filteredContracts = [...this.contracts];
        console.log(response);
      },
      (error) => {
        console.log(error.message);
      }
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => (this.users = data),
      (error) => console.error('Error fetching users', error)
    );
  }

  initEditForm(): void {
    this.editContractForm = this.fb.group({
      id: [],
      contractType: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
      workingHours: [0, Validators.required],
      benefits: ['', Validators.required],
      salary: [0, Validators.required],
      signed: [false, Validators.required],
      status: ['', Validators.required],
      // user: [{}],
      archived: [null],
    });
  }

  openAddContractModal(content: any): void {
    this.modalService.open(content, { size: 'lg' });
  }
  openEditContractModal(content: any, contract: Contract): void {
    this.editContractForm.patchValue(contract); // Remplir le formulaire avec les données du contrat
    this.modalService.open(content, { size: 'lg' });
  }

  saveChanges(): void {
    console.log('====================================');
    console.log(this.iduser);
    console.log('====================================');
    if (this.iduser) {
      console.log('====================================');
      console.log(this.newContract);
      console.log('====================================');
      this.contractService
        .createContract(this.newContract, this.iduser)
        .subscribe(
          () => {
            this.loadContracts();
            this.modalService.dismissAll();
            this.resetForm();
            Swal.fire({
              title: 'Contrat ajouté avec succès !',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          (error) => {
            console.error('Erreur lors de la création du contrat :', error);
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la création du contrat.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
    } else {
      console.error('ID utilisateur requis');
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez sélectionner un utilisateur.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  resetForm(): void {
    this.newContract = {
      contractType: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      workingHours: 0,
      benefits: '',
      salary: 0,
      signed: false,
      status: 'active',
    };
  }

  deleteContract(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Vous ne pourrez pas annuler cette action !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, archiver !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // Archiver le contrat
        this.contractService.archiveContrat(id).subscribe(
          () => {
            this.loadContracts(); // Recharger la liste des contrats actifs
            Swal.fire(
              'Archivé!',
              'Le contrat a été archivé et retiré de la liste des contrats actifs.',
              'success'
            );
          },
          (error) => {
            console.error("Erreur lors de l'archivage du contrat :", error);
            Swal.fire({
              title: 'Erreur !',
              text: "Une erreur est survenue lors de l'archivage du contrat.",
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    });
  }
  updateContract(): void {
    if (this.editContractForm.valid) {
      console.log('====================================');
      console.log(this.editContractForm.value);
      console.log('====================================');
      this.contractService
        .updateContract(
          this.editContractForm.value.id,
          this.editContractForm.value
        )
        .subscribe(
          () => {
            this.loadContracts();
            this.modalService.dismissAll();
            Swal.fire({
              title: 'Contrat mis à jour avec succès !',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du contrat :', error);
            Swal.fire({
              title: 'Erreur !',
              text: 'Une erreur est survenue lors de la mise à jour du contrat.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
    } else {
      console.error('Formulaire invalide');
      Swal.fire({
        title: 'Erreur !',
        text: 'Veuillez remplir tous les champs obligatoires.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  onContractSelect(event: any): void {
    this.iduser = event;
    console.log('Contrat sélectionné :', event);
  }
  downloadContract(contractId: number): void {
    this.expdfService.downloadContractPdf(contractId);
  }

  showFullBenefits(benefits: string): void {
    this.fullBenefits = benefits;
    this.isBenefitsModalOpen = true;
    console.log('Modal opened with benefits:', benefits);
  }

  closeBenefitsModal(): void {
    this.isBenefitsModalOpen = false;
  }
}



