import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from 'src/app/services/holiday.service';
import { HttpClient } from '@angular/common/http';
import { Holiday } from 'src/app/models/holiday.model';
import { AuthService } from 'src/app/services/auth.service'; // Importez le service AuthService

@Component({
  selector: 'app-holiday-request',
  templateUrl: './holiday-request.component.html',
  styleUrls: ['./holiday-request.component.css'],
})
export class HolidayRequestComponent implements OnInit {
  holidayRequestForm!: FormGroup;
  holidayTypes: string[] = [];
  leaveRequests: Holiday[] = [];
  currentUsername: string | null = null;

  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private http: HttpClient,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadCurrentUsername(); 
  }

  loadCurrentUsername() {
    this.currentUsername = this.authService.getUsername(); 
    console.log('====================================');
    console.log(this.currentUsername);
    console.log('====================================');
    if (this.currentUsername) {
  
      
      this.loadLeaveRequests(this.currentUsername); 
    } else {
      console.error("Aucun nom d'utilisateur trouvé.");
    }
  }

 
  loadLeaveRequests(username: string) {
    this.holidayService.getEmployeeHolidays(username).subscribe(
      (requests) => {
        this.leaveRequests = requests;
        console.log(requests);
        
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des demandes de congé:',
          error
        );
      }
    );
  }

  viewDetails(request: Holiday) {
   
    console.log('Détails de la demande:', request);
  }
}
