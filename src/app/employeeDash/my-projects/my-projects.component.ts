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
    this.projectService.getProjectsByEmployeeId(username).subscribe({
      next: (data) => {
        this.projects = data;
        this.errorMessage = null;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
        this.errorMessage = 'Failed to load projects. Please try again later.';
        this.projects = []; // Clear projects on error
      },
    });
  }

  getStatusClass(status: string | null | undefined): string {
    if (!status) {
      return 'status-default'; // Handle null/undefined cases
    }

    switch (
      status.toUpperCase() // Convert to uppercase for comparison
    ) {
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

  confirmDelete(projectId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(projectId).subscribe({
          next: () => {
            this.projects = this.projects.filter((p) => p.id !== projectId);
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Project deleted successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          error: (error) => {
            console.error('Error deleting project', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete project. Please try again.',
              confirmButtonText: 'OK',
            });
          },
        });
      }
    });
  }
}
