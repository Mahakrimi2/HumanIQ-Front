import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-dash-admin',
  templateUrl: './dash-admin.component.html',
  styleUrls: ['./dash-admin.component.css'],
})
export class DashAdminComponent implements OnInit {
  totalEmployees: number = 0;
  totalDep: number = 0;
  chart: any;
  userCountByRole: { [key: string]: number } = {};
  activeEmployees: any[] = [];
  inactiveEmployees: any[] = [];
  highPriorityCount = 0;
  mediumPriorityCount = 0;
  lowPriorityCount = 0;
  weatherData: any;
  city = 'Ariana'; // Ville par défaut
  weatherError: string | null = null;
  totalProjects = 0;
  priorityStats: any[] = [];
  priorityChart!: Chart;
  departments: { name: string; employeeCount: number }[] = [];
  employeeStats: { period: string; count: number }[] = [];
  currentTime: string = '';
  private intervalId: any;
  @ViewChild('priorityChart', { static: true })
  private chartRef: any;
  ngOnInit(): void {
    this.loadUserCountByRole();
    this.loadDepartments();
    this.loadEmployees();
    this.loadHireDate();
    this.loadData();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.loadPriorityStats();
    this.loadWeather();
  }

  constructor(
    private userService: UserService,
    private depService: DepartmentService,
    private projectService: ProjectServiceService,
    private weatherService: WeatherService
  ) {
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Nettoyer l'intervalle lorsque le composant est détruit
    }
  }

  // Méthode pour mettre à jour l'heure actuelle
  updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString(); // Formater l'heure au format local
  }
  loadWeather(): void {
    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.weatherError = null;
      },
      error: (err) => {
        this.weatherError = 'Impossible de charger les données météo';
        console.error('Erreur météo:', err);
      },
    });
  }

  loadDepartments(): void {
    this.depService.getAllDepartments().subscribe((departments) => {
      this.totalDep = departments.length;
      console.log(this.totalDep);
    });
  }

  loadUserCountByRole(): void {
    this.userService.getCountOfUsersByRole().subscribe(
      (data) => {
        this.userCountByRole = data;
        console.log("Nombre d'utilisateurs par rôle :", this.userCountByRole);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des utilisateurs par rôle',
          error
        );
      }
    );
  }

  loadEmployees(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        console.log('Données brutes des utilisateurs :', users);
        this.totalEmployees = users.length;

        this.activeEmployees = [];
        this.inactiveEmployees = [];

        users.forEach((user: any) => {
          if (user.isDisabled === undefined) {
            user.isDisabled = false;
          }

          if (!user.isDisabled) {
            this.activeEmployees.push(user);
          } else {
            this.inactiveEmployees.push(user); // Ajouter à la liste des employés inactifs
          }
        });

        console.log('Employés actifs :', this.activeEmployees);
        console.log('Employés inactifs :', this.inactiveEmployees);
      },
      (error) => {
        console.error('Erreur lors de la récupération des employés', error);
      }
    );
  }

  loadHireDate(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        console.log('Données brutes des utilisateurs :', users); // Étape 1

        const statsByMonth: Map<string, number> = new Map();

        users.forEach((user) => {
          if (user.hireDate) {
            const hireDate = new Date(user.hireDate);
            console.log("Date d'embauche convertie :", hireDate); // Étape 2

            if (isNaN(hireDate.getTime())) {
              console.error(
                "Date d'embauche invalide pour l'utilisateur :",
                user.id
              );
              return;
            }

            const year = hireDate.getFullYear();
            const month = hireDate.getMonth() + 1;
            const key = `${year}-${month.toString().padStart(2, '0')}`;
            console.log('Clé générée :', key); // Étape 3

            statsByMonth.set(key, (statsByMonth.get(key) || 0) + 1);
            console.log('Map des statistiques :', statsByMonth); // Étape 4
          } else {
            console.warn(
              "Date d'embauche manquante pour l'utilisateur :",
              user.id
            );
          }
        });

        this.employeeStats = Array.from(statsByMonth.entries()).map(
          ([period, count]) => ({
            period,
            count,
          })
        );
        console.log('Tableau final des statistiques :', this.employeeStats); // Étape 5

        this.employeeStats.sort((a, b) => a.period.localeCompare(b.period));
      },
      (error) => {
        console.error('Erreur lors de la récupération des employés', error);
      }
    );
  }

  loadData(): void {
    this.depService.getAllDepartments().subscribe(
      (departments: any[]) => {
        console.log('Départements récupérés :', departments);

        // Tableaux pour stocker les noms des départements et le nombre d'utilisateurs
        const departmentNames: string[] = [];
        const employeeCounts: number[] = [];

        // Pour chaque département, récupérer le nombre d'utilisateurs
        departments.forEach((department) => {
          departmentNames.push(department); // Ajouter le nom du département
          employeeCounts.push(department.users?.length || 0); // Ajouter le nombre d'utilisateurs (ou 0 si users est undefined)
          console.log('====================================');
          console.log(employeeCounts);
          console.log('====================================');
        });

        // Afficher le graphique avec les données réelles
        this.renderChart(departmentNames, employeeCounts);
      },
      (error) => {
        console.error('Erreur lors de la récupération des départements', error);
      }
    );
  }

  loadPriorityStats(): void {
    this.projectService.getAllProjects().subscribe((projects) => {
      console.log(projects);

      this.totalProjects = projects.length;

      this.highPriorityCount = projects.filter(
        (p) => p.priority === 'HIGH'
      ).length;

      this.mediumPriorityCount = projects.filter(
        (p) => p.priority === 'MEDIUM'
      ).length;
      this.lowPriorityCount = projects.filter(
        (p) => p.priority === 'LOW'
      ).length;

      this.priorityStats = [
        {
          priority: 'HIGH',
          count: this.highPriorityCount,
          percentage: Math.round(
            (this.highPriorityCount / this.totalProjects) * 100
          ),
          class: 'high-priority',
        },
        {
          priority: 'MEDIUM',
          count: this.mediumPriorityCount,
          percentage: Math.round(
            (this.mediumPriorityCount / this.totalProjects) * 100
          ),
          class: 'medium-priority',
        },
        {
          priority: 'LOW',
          count: this.lowPriorityCount,
          percentage: Math.round(
            (this.lowPriorityCount / this.totalProjects) * 100
          ),
          class: 'low-priority',
        },
      ];

      this.initPriorityChart();
    });
  }
  initPriorityChart(): void {
    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['High Priority', 'Medium Priority', 'Low Priority'],
        datasets: [
          {
            data: [
              this.highPriorityCount,
              this.mediumPriorityCount,
              this.lowPriorityCount,
            ],
            backgroundColor: ['#dc2626', '#d97706', '#16a34a'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const percentage = Math.round(
                  (value / this.totalProjects) * 100
                );
                return `${label}: ${value} (${percentage}%)`;
              },
            },
          },
        },
      },
    };

    this.priorityChart = new Chart(this.chartRef.nativeElement, config);
  }

  renderChart(departments: string[], employeeCounts: number[]): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error("L'élément 'departmentChart' n'existe pas dans le DOM.");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: departments.map((a: any) => a.name),
        datasets: [
          {
            label: "Nombre d'employés par département",
            data: employeeCounts,
            borderColor: 'rgba(75, 192, 192, 1)', // Couleur de la courbe
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true, // Remplir sous la courbe
            tension: 0.4, // Courbure de la ligne
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Nombre d'employés",
            },
          },
          x: {
            title: {
              display: true,
              text: 'Départements',
            },
          },
        },
      },
    });
  }
}
