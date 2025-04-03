import { Component, OnInit } from '@angular/core';
import { AvatarService } from 'src/app/avatar.service';
import { ChangePasswordRequest } from 'src/app/models/ChangePasswordRequest.model';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'],
})
export class UserProfilComponent implements OnInit {
  copyobj() {
    this.edituser.id = this.user.id;
    this.edituser.fullname = this.user.fullname;
    this.edituser.position = this.user.position;
    this.edituser.telNumber = this.user.telNumber;
    this.edituser.address = this.user.address;
  }
  changePasswordRequest: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
  };
  confirmNewPassword: string = '';
  user: any = {
    id: 0,
    fullname: '',
    username: '',
    address: '',
    position: '',
    telNumber: '',
  };

  isEditing = false;
  selectedFile: File | null = null;
  ProfilImageUrl: any;

  constructor(
    private userService: UserService,
    private avatarService: AvatarService
  ) {}
  ngOnInit(): void {
    this.uploadProfileImage();
    this.loadUserProfile();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    this.uploadProfileImage();
  }
  uploadProfileImage(): void {
    if (!this.user || !this.selectedFile) return;
    console.log(this.user, this.selectedFile);

    this.userService
      .uploadProfileImage(this.user.id, this.selectedFile)
      .subscribe({
        next: (imagePath) => {
          this.loadUserProfile();
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Profile image deleted successfully',
            confirmButtonText: 'OK',
          });
        },
        error: (err) => console.error('Failed to upload profile image', err),
      });
  }

  getAvatarInfo() {
    return this.avatarService.generateAvatar(this.user?.fullname || '');
  }

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (data) => {
        this.user = data;

        if (
          data.profileImagePath &&
          !data.profileImagePath.includes('anonyme')
        ) {
          this.ProfilImageUrl =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
        } else {
          this.ProfilImageUrl = null; // Forcera l'affichage de l'avatar
        }
      },
      error: (err) => console.error('Failed to load user profile', err),
    });
  }
  edituser: any = {
    id: 0,
    fullname: '',
    username: '',
    address: '',
    position: '',
    telNumber: '',
  };
  saveProfile(): void {
    this.userService.updateCurrentUserProfile(this.edituser).subscribe({
      next: (data) => {
        this.user = data;
        console.log(data);
        this.isEditing = false;

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile updated successfully',
          confirmButtonText: 'OK',
        });
      },
      error: (err) => {
        console.error('Failed to update user profile', err);

        let errorMessage = 'An error occurred while updating the profile.';
        if (err.status === 403) {
          errorMessage = 'You do not have permission to update this profile.';
        }

        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      },
    });
  }

  onDeleteProfileImage() {
    this.userService.deleteProfileImage(this.user.id).subscribe(
      (response) => {
        this.ProfilImageUrl = null; // Réinitialise pour afficher l'avatar
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Profile image deleted successfully',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while deleting the profile image',
          confirmButtonText: 'OK',
        });
      }
    );
  }
  onSubmit() {
    if (this.changePasswordRequest.newPassword !== this.confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'New password and confirm password do not match',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.userService.ChangePassword(this.changePasswordRequest).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Password changed successfully',
          confirmButtonText: 'OK',
        });
        this.changePasswordRequest = { oldPassword: '', newPassword: '' };
        this.confirmNewPassword = '';
      },
      (error: { error: any }) => {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to change password',
          confirmButtonText: 'OK',
        });
      }
    );
  }
}
