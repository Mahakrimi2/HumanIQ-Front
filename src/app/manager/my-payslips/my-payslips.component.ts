import { Component, OnInit } from '@angular/core';
import saveAs from 'file-saver';
import { PayslipService } from 'src/app/services/payslip.service';

@Component({
  selector: 'app-my-payslips',
  templateUrl: './my-payslips.component.html',
  styleUrls: ['./my-payslips.component.css']
})
export class MyPayslipsComponent implements OnInit {
  payslips: any[] = [];
  loading = false;

  constructor(private payslipService: PayslipService) {}

  ngOnInit(): void {
    this.loadPayslips();
  }

  loadPayslips(): void {
    this.loading = true;
    this.payslipService.getMyPayslips().subscribe(
      (data) => {
        this.payslips = data;
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
}

