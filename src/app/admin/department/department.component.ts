import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/models/department.model';
import { User } from 'src/app/models/user.model';
import { DepartmentService } from 'src/app/services/department.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments: Department[] = [];
  selectedDepartment!: Department;
  showAddDepartmentModal: boolean = false;
  showEditDepartmentModal: boolean = false;
  addDepartmentForm: FormGroup;
  updateDepartmentForm: FormGroup;
  listUser: any[] = [];
  departmentNames: string[] = [];
  availableHeads: User[] = [];

  Opentable: boolean = false;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    this.addDepartmentForm = this.fb.group({
      name: ['WebDevelopment', Validators.required],
      head: [null, Validators.required],
      totalEmployees: [''],
    });
    this.updateDepartmentForm = this.fb.group({
      name: ['', Validators.required],
      head: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadDepartmentNames();
    this.loadAvailableHeads();
  }

  loadDepartmentNames(): void {
    this.departmentService.getDepartmentNames().subscribe(
      (data: string[]) => {
        this.departmentNames = data;
      },
      (error) => {
        Swal.fire('Error', 'Failed to load department names', 'error');
      }
    );
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe(
      (data: Department[]) => {
        this.departments = data.map((department) => ({
          ...department,
          totalEmployees: department.users ? department.users.length : 0,
        }));
        console.log(this.departments);
      },
      (error) => {
        Swal.fire('Error', 'Failed to load departments', 'error');
      }
    );
  }

  loadAvailableHeads(): void {
    this.departmentService.getAvailableHeads().subscribe(
      (data: User[]) => {
        this.availableHeads = data;
        console.log(data);
      },
      (error) => {
        Swal.fire('Error', 'Failed to load available heads', 'error');
      }
    );
  }

  openAddDepartmentModal(): void {
    this.showAddDepartmentModal = true;
  }

  closeAddDepartmentModal(): void {
    this.showAddDepartmentModal = false;
    this.addDepartmentForm.reset();
  }

  openEditDepartmentModal(department: Department): void {
    this.selectedDepartment = department;

    // Pré-remplir le formulaire avec les données du département sélectionné
    this.updateDepartmentForm.patchValue({
      name: department.name,
      head: department.responsableDep?.id || null, // Utiliser l'ID du responsable existant
    });

    this.showEditDepartmentModal = true;
  }

  closeEditDepartmentModal(): void {
    this.showEditDepartmentModal = false;
    this.selectedDepartment;
    this.updateDepartmentForm.reset();
  }

  onAddDepartmentSubmit(): void {
    if (this.addDepartmentForm.invalid) {
      return;
    }

    const newDepartment: Department = {
      ...this.addDepartmentForm.value,
      users: [],
    };

    this.departmentService.createDepartment(newDepartment).subscribe(
      (response) => {
        Swal.fire('Success', 'Department added successfully!', 'success');
        this.closeAddDepartmentModal();
        this.loadDepartments();
      },
      (error) => {
        Swal.fire('Error', 'Failed to add department', 'error');
      }
    );
  }

  onUpdateDepartmentSubmit(): void {
    if (
      this.updateDepartmentForm.invalid ||
      !this.selectedDepartment ||
      !this.selectedDepartment.id
    ) {
      return;
    }

    const updatedDepartment = {
      ...this.updateDepartmentForm.value,
      head: Number(this.updateDepartmentForm.value.head), 
      id: this.selectedDepartment.id, 
    };

    console.log('Data being sent to backend:', updatedDepartment); 

    this.departmentService
      .updateDepartment(this.selectedDepartment.id, updatedDepartment)
      .subscribe(
        (response) => {
          console.log('Response from backend:', response); 
          Swal.fire('Success', 'Department updated successfully!', 'success');
          this.closeEditDepartmentModal();
          this.loadDepartments();
        },
        (error) => {
          Swal.fire('Error', 'Failed to update department', 'error');
        }
      );
  }
  deleteDepartment(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this department!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.departmentService.deleteDepartment(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'Department has been deleted.', 'success');
            this.loadDepartments(); // Recharger la liste après suppression
          },
          (error) => {
            Swal.fire('Error', 'Failed to delete department', 'error');
          }
        );
      }
    });
  }

  copyUsers(users: any[]): void {
    this.listUser = users;
    this.Opentable = !this.Opentable;
  }
}
