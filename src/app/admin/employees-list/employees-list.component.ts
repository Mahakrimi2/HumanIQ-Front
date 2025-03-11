import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import { saveAs as fileSaverSaveAs } from 'file-saver';
import { DepartmentService } from 'src/app/services/department.service';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  filteredUsers: User[] = [];
  searchText: string = '';
  departments: any[] = [];
  users: User[] = [];
  selectedUser: User | null = null;
  addUserForm!: FormGroup;
  editUserForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.initAddUserForm();
    this.initEditUserForm();
    this.loadUsers();
    this.loadDepartments();
  }

  initAddUserForm(): void {
    this.addUserForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      telNumber: ['', Validators.required],
      hireDate: ['', Validators.required],
      address: ['', Validators.required],
      nationalID: ['', Validators.required],
      position: ['', Validators.required],
      roles: [[{ name: 'ROLE_EMPLOYEE' }], Validators.required],
      password: ['', [Validators.required]],
      // department: ['', Validators.required],
    });
  }

  initEditUserForm(): void {
    this.editUserForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', [Validators.required, Validators.email]],
      telNumber: ['', Validators.required],
      hireDate: ['', Validators.required],
      address: ['', Validators.required],
      nationalID: ['', Validators.required],
      position: ['', Validators.required],
      //      password: ['', [Validators.required]],

      // department: ['', Validators.required],
    });
  }
  exportToExcel(): void {
    if (this.users.length === 0) {
      Swal.fire('Info', 'No data to export.', 'info');
      return;
    }

    const dataForExport = this.users.map((user) => ({
      'Full Name': user.fullname,
      Email: user.username,
      'Tel Number': user.telNumber,
      Address: user.address,
      Position: user.position,
      'Hire Date': user.hireDate,
      'National ID': user.nationalID,
    }));
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook: XLSX.WorkBook = {
      Sheets: { Employees: worksheet },
      SheetNames: ['Employees'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'employees_list');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    fileSaverSaveAs(
      data,
      fileName + '_export_' + new Date().getTime() + '.xlsx'
    );
  }

  filterUsers(event: any): void {
    const searchText = event.target.value.toLowerCase().trim();
    console.log('Search Text:', searchText);

    if (!searchText) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter((user) => {
        const fullname = user.fullname ? user.fullname.toLowerCase() : '';
        const username = user.username ? user.username.toLowerCase() : '';
        return fullname.includes(searchText) || username.includes(searchText);
      });
    }

    console.log('Filtered Users:', this.filteredUsers); // Afficher la liste filtrée
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.filteredUsers = [...data];
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      },
      error: (err: any) => console.error('Failed to load users:', err),
    });
  }
  Onselected(event: any) {
    this.selectedid = (event.target as HTMLSelectElement).value;
    console.log('====================================');
    console.log(this.selectedid);
    console.log('====================================');
  }
  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data: any[]) => {
        this.departments = data;
        console.log('====================================');
        console.log(data);
        console.log('====================================');
      },
      error: (err: any) => {
        console.error('Failed to load departments:', err);
      },
    });
  }
  deleteUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.users = this.users.filter((user) => user.id !== id);
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            this.loadUsers();
          },
          error: (err: any) => {
            console.error('Failed to delete user:', err);
            Swal.fire('Error', 'Failed to delete user', 'error');
          },
        });
      }
    });
  }
  selectedid: any;

  addUser(): any {
    if (this.addUserForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return; // Arrêter l'exécution si le formulaire est invalide
    }
    console.log('====================================');
    console.log(this.selectedid);
    console.log('====================================');
    const addButton = document.querySelector(
      '#addUserModal .btn-success'
    ) as HTMLButtonElement;
    if (addButton) {
      addButton.disabled = true;
    }
    const newUser = this.addUserForm.value;
    console.log('====================================');
    console.log(newUser);
    console.log('====================================');
    this.auth.register(newUser, this.selectedid).subscribe({
      next: (data: User) => {
        if (addButton) {
          addButton.disabled = false;
        }
        this.loadUsers();

        Swal.fire('Success', 'User added successfully!', 'success');
        this.addUserForm.reset();
        this.closeModal;
      },
      error: (err: any) => {
        console.error('Failed to add user:', err);
        Swal.fire('Error', 'Failed to add user', 'error');
      },
    });
  }

  saveChanges(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      const updatedUser = { ...this.selectedUser, ...this.editUserForm.value };
      console.log('====================================');
      console.log(this.selectedUser.id, this.editUserForm.value);
      console.log('====================================');
      this.userService
        .updateUser(this.selectedUser.id, this.editUserForm.value)
        .subscribe({
          next: (data: User) => {
            const index = this.users.findIndex((u) => u.id === data.id);
            if (index !== -1) {
              this.users[index] = data;
            }
            Swal.fire('Success', 'User updated successfully!', 'success');
            this.closeModal('editUserModal');
            this.loadUsers();
          },
          error: (err: any) => {
            console.error('Failed to update user:', err);
            Swal.fire('Error', 'Failed to update user', 'error');
          },
        });
    } else {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
    }
  }

  openModal(modalId: string, user?: User): void {
    const modalOptions = {
      backdrop: false, // Désactive le backdrop
    };
    if (modalId === 'editUserModal' && user) {
      this.selectedUser = user;
      this.editUserForm.patchValue(user);
    }

    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedUser = null;
    this.editUserForm.reset(); // Réinitialise le formulaire
  }
}
function saveAs(data: Blob, arg1: string) {
  throw new Error('Function not implemented.');
}

