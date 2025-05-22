import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Holiday } from 'src/app/models/holiday.model';
import { AuthService } from 'src/app/services/auth.service';
import { HolidayService } from 'src/app/services/holiday.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-request-listmanager',
  templateUrl: './request-listmanager.component.html',
  styleUrls: ['./request-listmanager.component.css']
})
export class RequestListmanagerComponent implements OnInit {
  holidayRequestForm!: FormGroup;
  holidayTypes: string[] = [];
  leaveRequests: any[] = [];
  currentUsername: string | null = null;
  ProfilImageUrl: any;
  constructor(
    private fb: FormBuilder,
    private holidayService: HolidayService,
    private http: HttpClient,
    private authService: AuthService,
    private serviceUser: UserService
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
        this.leaveRequests = requests.map((data: any) => {
          let baseUrl = 'http://localhost:8082/api/rh/users/profileImage/';
          let fileUrl = data.ficher
            ? baseUrl + data.ficher
            : 'assets/img/anonyme.jpg';

          return {
            ...data,
            isPdf: data.ficher?.toLowerCase().endsWith('.pdf'),
            fileUrl: fileUrl,
          };
        });

        console.log(this.leaveRequests);
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
