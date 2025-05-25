import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import { saveAs as fileSaverSaveAs } from 'file-saver';
import { DepartmentService } from 'src/app/services/department.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css'],
})
export class EmployeesListComponent implements OnInit {
  filteredUsers: any[] = [];
  departments: any[] = [];
  paginatedUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalItems: number = 0;
  users: User[] = [];
  selectedUser: User | null = null;
  addUserForm!: FormGroup;
  editUserForm!: FormGroup;
  roles: any[] | undefined;
  selectedDepartment: string = '';
  searchText: string = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  loading: boolean = false;
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
    this.loadRoles();
  }

  initAddUserForm(): void {
    this.addUserForm = this.fb.group({
      fullname: ['', Validators.required, Validators.minLength(3)],
      username: ['', [Validators.required, Validators.email]],
      telNumber: ['', Validators.required, Validators.minLength(6)],
      hireDate: ['', Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      address: ['', Validators.required],
      nationalID: ['', Validators.required],
      position: ['', Validators.required],
      roles: [[], Validators.required],
      password: ['', [Validators.required]],
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
      roles: [[], Validators.required],
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
  SelectedRole: any;
  selectRole(event: any) {
    this.SelectedRole = event.value;
    console.log(this.selectRole);
  }

  getFirstInitial(fullname: string): string {
    return fullname?.charAt(0)?.toUpperCase() || '?';
  }

  getAvatarColor(fullname: string): string {
    const darkColors = [
      '#2c3e50', 
      '#34495e', 
      '#2c3e50', 
      '#1a237e',
      '#0d47a1',
      '#263238', 
      '#212121',
      '#311b92', 
    ];
    const charCode = fullname?.charCodeAt(0) || 0;
    return darkColors[charCode % darkColors.length];
  }
  isDefaultImage(profileImagePath: string): boolean {
    return !profileImagePath || profileImagePath.includes('anonyme');
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
    this.totalItems = this.filteredUsers.length;
    this.currentPage = 1;
    this.updatePaginatedUsers();
    console.log('Filtered Users:', this.filteredUsers);
  }

  applyFilters(): void {
    this.filteredUsers = [...this.users];

    if (this.searchText) {
      const searchText = this.searchText.toLowerCase().trim();
      this.filteredUsers = this.filteredUsers.filter(
        (user) =>
          user.fullname?.toLowerCase().includes(searchText) ||
          user.username?.toLowerCase().includes(searchText)
      );
    }

    if (this.statusFilter !== 'all') {
      this.filteredUsers = this.filteredUsers.filter((user) =>
        this.statusFilter === 'active' ? !user.isDisabled : user.isDisabled
      );
    }

    if (this.sortColumn) {
      this.sortUsers();
    }
    this.updatePagination();
  }

  private sortUsers(): void {
    this.filteredUsers.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof User];
      const valueB = b[this.sortColumn as keyof User];

      if (this.sortColumn === 'isDisabled') {
        return this.sortDirection === 'asc'
          ? a.isDisabled === b.isDisabled
            ? 0
            : a.isDisabled
            ? 1
            : -1
          : a.isDisabled === b.isDisabled
          ? 0
          : a.isDisabled
          ? -1
          : 1;
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'fa-sort';
    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  private updatePagination(): void {
    this.totalItems = this.filteredUsers.length;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  ProfilImageUrl: any;

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.users = data.map((user: any) => ({
          ...user,
          profileImageUrl:
            user.profileImagePath && !user.profileImagePath.includes('anonyme')
              ? 'http://localhost:8082/api/rh/users/profileImage/' +
                user.profileImagePath
              : null,
        }));
        this.filteredUsers = [...this.users];
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        this.totalItems = this.filteredUsers.length;
        this.updatePaginatedUsers();
      },
      error: (err: any) => console.error('Failed to load users:', err),
    });
  }

  onRoleChange(event: any) {
    const selectedRoles = this.addUserForm.value.roles || [];
    const roleName = event.target.value;
    console.log('====================================');
    console.log(roleName);
    console.log('====================================');
    if (roleName) {
      selectedRoles.push({ name: roleName });
    }
    console.log(selectedRoles);

    this.addUserForm.patchValue({ roles: selectedRoles });
  }
  onRoleChangeupdate(event: any) {
    const selectedRoles = this.editUserForm.value.roles || [];
    const roleName = event.target.value;
    console.log('====================================');
    console.log(roleName);
    console.log('====================================');
    if (roleName) {
      selectedRoles.push({ name: roleName });
    }
    console.log(selectedRoles);

    this.editUserForm.patchValue({ roles: selectedRoles });
  }
  loadRoles(): void {
    this.userService.getroles().subscribe({
      next: (roles: string[]) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
      },
      complete: () => {
        console.log('Role loading completed');
      },
    });
  }

  Onselected(event: any) {
    this.selectedid = (event.target as HTMLSelectElement).value;
    console.log(this.selectedid);
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

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // this.updatePaginatedUsers();
    this.updatePagination();
  }
  disableUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to disable this account? This action can be reverted later.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.disactivateUser(id).subscribe({
          next: () => {
            const user = this.users.find((u) => u.id === id);
            if (user) {
              user.isDisabled = true;
            }
            Swal.fire('Disabled!', 'The account has been disabled.', 'success');
            this.loadUsers();
          },
          error: (err: any) => {
            console.error('Failed to disable user:', err);
            Swal.fire('Error', 'Failed to disable the account', 'error');
          },
        });
      }
    });
  }

  confirmDelete(id: number): void {
    Swal.fire({
      title: 'Delete Permanently?',
      text: 'This will permanently delete the user and all their data. This cannot be undone!',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
            Swal.fire(
              'Deleted!',
              'User has been permanently deleted.',
              'success'
            );
          },
          error: (err) => {
            console.error('Delete failed:', err);
            Swal.fire('Error', 'Failed to delete user', 'error');
          },
        });
      }
    });
  }
  enableUser(userId: number): void {
    Swal.fire({
      title: 'Activate User Account',
      text: 'Are you sure you want to activate this account?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, activate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#28a745',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.enableUser(userId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Activated!',
              text: 'The account has been successfully activated.',
              icon: 'success',
              confirmButtonColor: '#28a745',
            });
            this.loadUsers();
            const user = this.users.find((u) => u.id === userId);
            if (user) {
              user.isDisabled = false;
            }
          },
          error: (error) => {
            console.error('Activation failed:', error);
            Swal.fire({
              title: 'Activation Failed',
              text:
                error.message ||
                'Could not activate the account. Please try again.',
              icon: 'error',
              confirmButtonColor: '#dc3545',
            });
          },
        });
      }
    });
  }

  selectedid: any;

  addUser(): any {
    if (this.addUserForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }
    console.log(this.selectedid);
    this.loading = true;
    const newUser = this.addUserForm.value;
    console.log(newUser);
    this.auth.register(newUser, this.selectedid).subscribe({
      next: (data: User) => {
        this.loadUsers();
        this.loading = false;

        Swal.fire('Success', 'User added successfully!', 'success');
        this.addUserForm.reset();
        this.closeModal;
      },
      error: (err: any) => {
        console.error('Failed to add user:', err);
        this.loading = false;

        Swal.fire('Error', 'Failed to add user', 'error');
      },
    });
  }

  saveChanges(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      console.log(this.editUserForm.value);
      this.userService
        .updateUser(this.selectedUser.id, this.editUserForm.value)
        .subscribe({
          next: (data: User) => {
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





