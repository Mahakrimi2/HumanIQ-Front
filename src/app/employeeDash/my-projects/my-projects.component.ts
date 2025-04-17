import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project.model';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { TrelloService } from 'src/app/services/trello-servicz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.css'],
})
export class MyProjectsComponent implements OnInit {
  projects: Project[] = [];
  employeeId: number = 39;
  username: string | null = null;
  errorMessage: string | null = null;
  showTrelloAuth = false;
  currentTrelloData: {
    projectId: number;
    lists: any[];
  } | null = null;
  loadingTrello = false;
  constructor(
    private projectService: ProjectServiceService,
    private authService: AuthService,
    private trelloService: TrelloService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.username) {
      this.loadProjects(this.username);
    } else {
      console.error('Username not found. Please log in.');
    }
  }

  loadProjects(username: string): void {
    this.projectService.getProjectsByEmployeeId(username).subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error fetching projects:', error);
      }
    );
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  viewTrelloBoard(projectName: string): void {
    this.trelloService.getBoards().subscribe({
      next: (boards) => {
        console.log('====================================');
        console.log(boards);
        console.log('====================================');
        const board = boards.find((b) => b.name === projectName);
        if (board) {
          console.log(board);

          this.showTrelloAuthDialog(board.id, projectName);
        } else {
          Swal.fire(
            'Error',
            `No Trello board found for project "${projectName}"`,
            'error'
          );
        }
      },
    });
  }

  private showTrelloAuthDialog(boardId: string, projectName: string): void {
    Swal.fire({
      title: 'Connect to Trello Required',
      text: `You need to connect your Trello account to view tasks for "${projectName}"`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Connect Now',
      cancelButtonText: 'Maybe Later',
    }).then((result) => {
      if (result.isConfirmed) {
        // Stocker le nom du projet pour redirection après auth
        localStorage.setItem('trello_redirect_project', projectName);
        window.location.href = `https://trello.com/b/${boardId}/${projectName}`;
      }
    });
  }
}
