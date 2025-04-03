import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from 'src/app/models/project.model';
import { User } from 'src/app/models/user.model';
import { ProjectServiceService } from 'src/app/services/project-service.service';
import { UserService } from 'src/app/services/user.service';
import { TrelloService } from 'src/app/trello-servicz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateY(20px)' }),
  //       animate(
  //         '500ms ease-out',
  //         style({ opacity: 1, transform: 'translateY(0)' })
  //       ),
  //     ]),
  //   ]),
  // ],
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  employees: any[] = [];
  showAddProjectModal = false;
  currentStep = 1;
  addProjectWizardForm: FormGroup;

  showEditProjectModal = false;
  editProjectForm: FormGroup;
  selectedProject: Project | null = null;
  ProjectsNames: string[] = [];
  ProjectsPriority: string[] = [];
  searchControl = new FormControl('');
  filteredEmployees: any[] = [];
  selectedEmployees: any[] = [];

  onEmployeeSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedEmployeeId = selectElement.value;

    if (selectedEmployeeId) {
      const selectedEmployee = this.employees.find(
        (e) => e.id === +selectedEmployeeId
      );

      if (selectedEmployee && !this.isSelected(selectedEmployee)) {
        this.selectedEmployees.push(selectedEmployee);
        this.updateAssignedEmployeesFormControl();
      }

      selectElement.value = '';
    }
  }

  isSelected(employee: any): boolean {
    return this.selectedEmployees.some((e) => e.id === employee.id);
  }

  toggleEmployeeSelection(employee: any): void {
    if (this.isSelected(employee)) {
      this.removeEmployee(employee);
    } else {
      this.selectEmployee(employee);
    }
  }

  selectEmployee(employee: any): void {
    this.selectedEmployees.push(employee);
    this.updateAssignedEmployeesFormControl();
  }

  removeEmployee(employee: any): void {
    this.selectedEmployees = this.selectedEmployees.filter(
      (e) => e.id !== employee.id
    );
    this.updateAssignedEmployeesFormControl();
  }

  updateAssignedEmployeesFormControl(): void {
    const assignedEmployeeIds = this.selectedEmployees.map((e) => e.id);
    this.addProjectWizardForm
      .get('assignedEmployees')
      ?.setValue(assignedEmployeeIds);
  }

  constructor(
    private projectService: ProjectServiceService,
    private userService: UserService,
    private fb: FormBuilder,
    private trelloService:TrelloService
  ) {
    this.addProjectWizardForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      projectManager: ['', Validators.required],
      assignedEmployees: [[], Validators.required],
    });

    this.editProjectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.trelloService
      .addMemberToBoard('UwZB1ACH', 'email@exemple.com', 'normal')
      .subscribe({
        next: (response) => console.log('Membre ajouté avec succès:', response),
        error: (error) => console.error('Erreur:', error),
      });
  this.trelloService.getBoards().subscribe({
    next: (boards) => {
      console.log('Liste des boards:', boards);
      boards.forEach((board) =>
        console.log(`ID: ${board.id}, Nom: ${board.name}`)
      );
    },
    error: (error) => console.error('Erreur:', error),
  });

    this.loadProjects();
    this.loadEmployees();
    this.loadProjectStatus();
    this.loadProjectPriority();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error('Error loading projects', error);
      }
    );
  }

  loadProjectStatus(): void {
    this.projectService.getProjectsByStatus().subscribe(
      (data: any[]) => {
        this.ProjectsNames = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      },
      (error) => {
        console.error('Error loading project status', error);
      }
    );
  }

  loadProjectPriority(): void {
    this.projectService.getProjectsByPriority().subscribe(
      (data: any[]) => {
        this.ProjectsPriority = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      },
      (error) => {
        console.error('Error loading project priority', error);
      }
    );
  }
  loadEmployees(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.employees = data;
      },
      (error) => {
        console.error('Error loading employees', error);
      }
    );
  }

  openAddProjectModal(): void {
    this.showAddProjectModal = true;
    this.currentStep = 1; // Reset wizard to step 1
    this.addProjectWizardForm.reset();
  }

  closeAddProjectModal(): void {
    this.showAddProjectModal = false;
    this.currentStep = 1;
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  onAddProjectSubmit(): void {
    if (this.addProjectWizardForm.valid) {
      const formValues = this.addProjectWizardForm.value;

      const employeeIds = formValues.assignedEmployees || [];
      const projectManagerId = formValues.projectManager;

      const project: Project = {
        name: formValues.name,
        description: formValues.description,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        status: formValues.status,
        priority: formValues.priority,
      };

      this.projectService
        .createProject(project, projectManagerId, employeeIds)
        .subscribe(
          (response) => {
            this.closeAddProjectModal();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Project created successfully!',
              confirmButtonText: 'OK',
            });
            this.loadProjects();
             this.trelloService
               .createBoard(project.name)
               .subscribe((response) => {
                 console.log('Trello Board Created:', response);
                 alert('Trello Board successfully created!');
               });
          },
          (error) => {
            console.error('Full error response:', error); // Log the full error
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to create project. Please try again.',
              confirmButtonText: 'OK',
            });
          }
        );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill all required fields.',
        confirmButtonText: 'OK',
      });
    }
  }
  deleteProject(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this project!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectService.deleteProject(id).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Project deleted successfully!',
              confirmButtonText: 'OK',
            });
            this.loadProjects();
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete project. Please try again.',
              confirmButtonText: 'OK',
            });
            console.error('Error deleting project', error);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Cancelled',
          text: 'Your project is safe :)',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  openEditProjectModal(project: Project): void {
    this.selectedProject = project;
    this.editProjectForm.patchValue({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      status: project.status,
      priority: project.priority,
    });
    this.showEditProjectModal = true;
  }

  closeEditProjectModal(): void {
    this.showEditProjectModal = false;
    this.editProjectForm.reset();
    this.selectedProject = null;
  }

  onEditProjectSubmit(): void {
    if (this.editProjectForm.valid && this.selectedProject) {
      const formValues = this.editProjectForm.value;

      const updatedProject = {
        ...formValues,
        id: this.selectedProject.id,
      };

      console.log('Data being sent to the backend:', updatedProject);

      this.projectService
        .updateProject(updatedProject.id, updatedProject)
        .subscribe(
          (response) => {
            this.closeEditProjectModal();
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Project updated successfully!',
              confirmButtonText: 'OK',
            }).then(() => {
              this.closeEditProjectModal(); // Fermer le modal après la confirmation
              this.loadProjects(); // Recharger la liste des projets
            });
          },
          (error) => {
            console.error('Full error response:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to update project. Please try again.',
              confirmButtonText: 'OK',
            });
          }
        );
    }
  }


}
