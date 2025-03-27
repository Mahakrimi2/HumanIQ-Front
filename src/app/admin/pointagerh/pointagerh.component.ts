import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PointageService } from 'src/app/services/pointage-service.service';

@Component({
  selector: 'app-pointagerh',
  templateUrl: './pointagerh.component.html',
  styleUrls: ['./pointagerh.component.css']  ,
  animations: [
      
      trigger('buttonAnimation', [
        state(
          'normal',
          style({
            transform: 'scale(1)',
          })
        ),
        state(
          'hover',
          style({
            transform: 'scale(1.1)',
          })
        ),
        transition('normal <=> hover', animate('200ms ease-in-out')),
      ]),
  
      trigger('cardAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate(
            '0.5s ease-out',
            style({ opacity: 1, transform: 'translateY(0)' })
          ),
        ]),
      ]),
    ],
  })
export class PointagerhComponent  implements OnInit {
  currentPointageId: number | null = null;
  getpointage: any;
  arrivalTime: string | null = null;
  pauseStartTime: string | null = null;
  pauseEndTime: string | null = null;
  departureTime: string | null = null;
  isArrivalPointed = false;
  isPausePointed = false;
  isReturnPointed = false;
  isDeparturePointed = false;
  currentUsername: string = '';

  constructor(
    private pointageService: PointageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const savedDate = localStorage.getItem('lastPointageDate');
    const today = new Date().toISOString().split('T')[0];
  
    if (savedDate !== today) {
      this.resetAllVariables();
      localStorage.setItem('lastPointageDate', today);
    }
    const username = this.authService.getUsername();
    this.currentPointageId = Number(localStorage.getItem('idpointage')) || null;
    this.loadButtonStates();
    this.getPointagebyid();
    if (username) {
      this.currentUsername = username;
    } else {
      console.error('Nom d\'utilisateur non trouvé.');
    }
  }
  resetAllVariables(): void {
    this.currentPointageId = null;
    this.arrivalTime = null;
    this.pauseStartTime = null;
    this.pauseEndTime = null;
    this.departureTime = null;
    this.isArrivalPointed = false;
    this.isPausePointed = false;
    this.isReturnPointed = false;
    this.isDeparturePointed = false;
    localStorage.removeItem('idpointage');
    localStorage.removeItem('isArrivalPointed');
    localStorage.removeItem('isPausePointed');
    localStorage.removeItem('isReturnPointed');
    localStorage.removeItem('isDeparturePointed');
  }
  
  loadButtonStates(): void {
    this.isArrivalPointed = JSON.parse(localStorage.getItem('isArrivalPointed') || 'false');
    this.isPausePointed = JSON.parse(localStorage.getItem('isPausePointed') || 'false');
    this.isReturnPointed = JSON.parse(localStorage.getItem('isReturnPointed') || 'false');
    this.isDeparturePointed = JSON.parse(localStorage.getItem('isDeparturePointed') || 'false');
  }

  saveButtonStates(): void {
    localStorage.setItem('isArrivalPointed', JSON.stringify(this.isArrivalPointed));
    localStorage.setItem('isPausePointed', JSON.stringify(this.isPausePointed));
    localStorage.setItem('isReturnPointed', JSON.stringify(this.isReturnPointed));
    localStorage.setItem('isDeparturePointed', JSON.stringify(this.isDeparturePointed));
  }

  getPointagebyid(): void {
    if (!this.currentPointageId) return;
    this.pointageService.getPointagesByid(this.currentPointageId).subscribe(
      (data: any) => {
        this.arrivalTime = data.arrivalTime ?? null;
        this.pauseStartTime = data.pauseStartTime ?? null;
        this.pauseEndTime = data.pauseEndTime ?? null;
        this.departureTime = data.departureTime ?? null;
        this.getpointage = data;
        console.log(data);
        
      },
      (error) => {
        console.error('Erreur lors du chargement des pointages:', error);
      }
    );
  }

  pointArrival(): void {
    this.arrivalTime = new Date().toISOString();
    console.log(this.arrivalTime);
    
    this.isArrivalPointed = true;
    this.saveButtonStates();
    this.savePointage();
  }

  pointPause(): void {
    if (!this.currentPointageId) return;
    this.pauseStartTime = new Date().toISOString();
    this.isPausePointed = true;
    this.saveButtonStates();
    this.updatepointage();
  }

  pointReturn(): void {
    if (!this.currentPointageId) return;
    this.pauseEndTime = new Date().toISOString();
    this.isReturnPointed = true;
    this.saveButtonStates();
    this.updatepointage();
  }

  pointDeparture(): void {
    if (!this.currentPointageId) return;
    this.departureTime = new Date().toISOString();
    this.isDeparturePointed = true;
    this.saveButtonStates();
    this.updatepointage();
    localStorage.removeItem('idpointage');
  }

  updatepointage(): void {
    if (!this.currentPointageId) return;
    const pointageData = {
      arrivalTime: this.arrivalTime,
      pauseStartTime: this.pauseStartTime,
      pauseEndTime: this.pauseEndTime,
      departureTime: this.departureTime,
    };
    this.pointageService.updatePointage(this.currentPointageId, pointageData).subscribe(
      (response) => {
        console.log('Pointage mis à jour:', response);
        this.getPointagebyid();
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du pointage:', error);
      }
    );
  }

  savePointage(): void {
    const pointageData = {
      arrivalTime: this.arrivalTime,
      pauseStartTime: null,
      pauseEndTime: null,
      departureTime: null,
    };
    this.pointageService.createPointage(this.currentUsername, pointageData).subscribe(
      (response) => {
        console.log('Pointage enregistré:', response);
        localStorage.setItem('idpointage', String(response.id));
        this.currentPointageId = Number(localStorage.getItem("idpointage"));
        this.getPointagebyid();
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement du pointage:', error);
      }
    );
  }
}
