import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DepartmentService } from 'src/app/services/department.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs as fileSaverSaveAs } from 'file-saver';

@Component({
  selector: 'app-employees-list-admin',
  templateUrl: './employees-list-admin.component.html',
  styleUrls: ['./employees-list-admin.component.css'],
})
export class EmployeesListAdminComponent implements OnInit {
  filteredUsers: any[] = [];
  searchText: string = '';
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
  SelectedRole: any;
  selectRole(event: any) {
    this.SelectedRole = event.value;
    console.log(this.selectRole);
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
    this.totalItems = this.filteredUsers.length;
    this.currentPage = 1;
    this.updatePaginatedUsers();

    console.log('Filtered Users:', this.filteredUsers);
  }
  ProfilImageUrl: any;

  // loadUsers(): void {
  //   this.userService.getAllUsers().subscribe({
  //     next: (data: User[]) => {
  //       console.log(data);

  //       this.filteredUsers = data.map((user: any) => ({
  //         ...user,
  //         profileImageUrl:
  //           'http://localhost:8082/api/rh/users/profileImage/' +
  //           user.profileImagePath,

  //       }
  //       ));

  //       // this.filteredUsers = [...data];
  //       console.log('====================================');
  //       console.log(data);
  //       console.log('====================================');
  //     },
  //     error: (err: any) => console.error('Failed to load users:', err),
  //   });
  // }

  loadUsers(): void {
    this.userService.getAllUserscomm().subscribe({
      next: (data: User[]) => {
        this.users = data.map((user: any) => ({
          ...user,
          profileImageUrl:
            'http://localhost:8082/api/rh/users/profileImage/' +
            user.profileImagePath,
        }));
        this.filteredUsers = [...this.users]; // Initialiser les utilisateurs filtrés
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        this.totalItems = this.filteredUsers.length; // Mettre à jour le nombre total d'éléments
        this.updatePaginatedUsers(); // Mettre à jour les utilisateurs paginés
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
  getFirstInitial(fullname: string): string {
    return fullname?.charAt(0)?.toUpperCase() || '?';
  }

  getAvatarColor(fullname: string): string {
    const darkColors = [
      '#2c3e50', // Noir bleuté très foncé
      '#34495e', // Noir bleuté foncé
      '#2c3e50', // Bleu nuit
      '#1a237e', // Bleu indigo foncé
      '#0d47a1', // Bleu marine
      '#263238', // Gris anthracite
      '#212121', // Noir profond
      '#311b92', // Violet très foncé
    ];

    const charCode = fullname?.charCodeAt(0) || 0;
    return darkColors[charCode % darkColors.length];
  }
  isDefaultImage(profileImagePath: string): boolean {
    return !profileImagePath || profileImagePath.includes('anonyme');
  }
  onRoleChangeupdate(event: any) {
    const selectedRoles = this.editUserForm.value.roles || [];
    const roleName = event.target.value;
    if (selectedRoles.length > 0) {
      selectedRoles.pop();
    }
    selectedRoles.push({ name: roleName });
    this.editUserForm.patchValue({ roles: selectedRoles });
    console.log(this.editUserForm.value);
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
    this.updatePaginatedUsers();
  }
  deleteUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to disable this account? This action can be reverted later.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
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
  selectedid: any;

  addUser(): any {
    if (this.addUserForm.invalid) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }
    console.log(this.selectedid);

    const newUser = this.addUserForm.value;
    console.log(newUser);
    this.auth.register(newUser, this.selectedid).subscribe({
      next: (data: User) => {
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
