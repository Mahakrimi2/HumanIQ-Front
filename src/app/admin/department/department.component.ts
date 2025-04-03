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
  departmentNames: any[] = [];
  availableHeads: User[] = [];

  Opentable: boolean = false;
  selecteuserid: any;
  Onselected(event: any) {
    this.selecteuserid = (event.target as HTMLSelectElement).value;
    console.log('====================================');
    console.log(this.selecteuserid);
    console.log('====================================');
  }
  selecteid: any;
  selectedDepartmentName: string = '';

  Onselecteddep(event: Event) {
    this.selecteid = (event.target as HTMLSelectElement).value;
  }

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {
    this.addDepartmentForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.updateDepartmentForm = this.fb.group({
      name: ['', Validators.required],
      id:[]
    });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadDepartmentNames();
    this.loadAvailableHeads();
  }

  loadDepartmentNames(): void {
    this.departmentService.getDepartmentNames().subscribe(
      (data: any[]) => {
        this.departmentNames = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
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
    console.log('====================================');
    console.log(department);
    console.log('====================================');
    this.updateDepartmentForm.patchValue({
      name: department.name,
      id: department.id || null, 
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

    console.log(this.addDepartmentForm.value);

    this.departmentService
      .createDepartment(this.addDepartmentForm.value.name, this.selecteuserid)
      .subscribe(
        (response) => {
          Swal.fire('Success', 'Department added successfully!', 'success');
          this.closeAddDepartmentModal();
          this.loadDepartments();
        },
        (error) => {
          console.log(error);

          Swal.fire('Error', 'Failed to add department', 'error');
        }
      );
  }

  onUpdateDepartmentSubmit(): void {
    if (this.updateDepartmentForm.invalid) {
      return;
    }

    console.log(
      'Data being sent to backend:',
      this.selecteuserid,
      this.updateDepartmentForm.value.id,
      this.selecteid
    );

    this.departmentService
      .updateDepartment(
        this.updateDepartmentForm.value.id,
        this.updateDepartmentForm.value.name,
        this.selecteuserid
      )
      .subscribe(
        (response) => {
          console.log('Response from backend:', response);
          Swal.fire('Success', 'Department updated successfully!', 'success');
          this.closeEditDepartmentModal();
          this.loadDepartments();
        },
        (error) => {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
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
            console.log('====================================');
            console.log(error);
            console.log('====================================');
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
