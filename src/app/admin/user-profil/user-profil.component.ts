import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profil',
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.css'],
})
export class UserProfilComponent implements OnInit {
  user: User = {
    id: 0,
    fullname: '',
    username: '',
    gender: '',
    address: '',
    position: '',
    salary: 0,
    telNumber: '',
    hireDate: new Date(),
    email: '',
    roles: '',
    nationalID: '',
    profileImagePath: '',
    dateOfBirth: new Date(),
    accountVerified: false, // Ajouté
    isDisabled: false,
  };
  isEditing = false;
  selectedFile: File | null = null;
  ProfilImageUrl: any;

  constructor(private userService: UserService) {}
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

  /*
  removeProfileImage(): void {
    if (!this.user) return;

    this.userService.removeProfileImage(this.user.id).subscribe({
      next: () => {
        this.user!.profileImagePath = 'assets/img/anonyme.jpg'; // Image par défaut
        alert('Profile image removed successfully!');
      },
      error: (err) => console.error('Failed to remove profile image', err),
    });
  }
*/

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (data) => {
        // Ajouter l'URL de base au chemin de l'image

        //   this.userService.getProfileImage(data.profileImagePath).subscribe(data=>{
        //     console.log("image insére avec succes", data);
        //     this.ProfilImageUrl = data;
        //   }, (error)=>{
        //     console.error("error",error);
        //  });
        if (data && data.profileImagePath) {
          this.ProfilImageUrl =
            'http://localhost:8082/api/rh/users/profileImage/' +
            data.profileImagePath;
          this.user = data;
        } else {
          this.ProfilImageUrl = 'assets/img/anonyme.jpg';
          this.user = data;
        }
      },

      error: (err) => console.error('Failed to load user profile', err),
    });
  }
  saveProfile(): void {
    this.userService.updateCurrentUserProfile(this.user).subscribe({
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
        console.log(response); // Affiche "Profile image deleted successfully"
        this.user.profileImagePath = ''; // Supprimer le chemin de l'image
        this.ProfilImageUrl = 'assets/img/anonyme.jpeg';
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
}
