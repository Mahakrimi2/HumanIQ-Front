import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Contract } from 'src/app/models/contract.model';
import { AuthService } from 'src/app/services/auth.service';
import { ContractService } from 'src/app/services/contract.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  contracts: Contract[] = [];


  username: string | null = null;
  constructor(
    private contractService: ContractService,
    private authService: AuthService,
    private router: Router,
    private expPdf: ExportPdfService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.loadContracts(this.username);
    } else {
      console.error('Username not found. Please log in.');
      this.router.navigate(['/login']);
    }
  }

  loadContracts(username: string): void {
    this.contractService.getContratByUsername(username).subscribe(
      (data) => {
        this.contracts = data;
        console.log(data);
        
      },
      (error) => {
        console.error('Error fetching contracts:', error);
      }
    );
  }

  downloadContract(contractId: number): void {
    console.log(contractId);
    
    this.expPdf.downloadContractPdf(contractId);
  }
}