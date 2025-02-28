import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private userService: UserService) {}
  ngOnInit(): void {
    this.loadUserProfile();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadProfileImage();
    }
  }
  uploadProfileImage(): void {
    if (!this.user || !this.selectedFile) return;

    this.userService
      .uploadProfileImage(this.user.id, this.selectedFile)
      .subscribe({
        next: (imagePath) => {
          // Mettre à jour le chemin de l'image dans l'utilisateur
          this.user!.profileImagePath = `http://localhost:4300/uploads/${imagePath}`;
          alert('Profile image updated successfully!');
        },
        error: (err) => console.error('Failed to upload profile image', err),
      });
  }

  exportProfileImage(): void {
    if (!this.user) return;

    this.userService.getProfileImage(this.user.profileImagePath).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'profile-image.png'; // Nom du fichier téléchargé
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Failed to export profile image', err),
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
  // Charger le profil utilisateur
  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (data) => {
        // Ajouter l'URL de base au chemin de l'image
        data.profileImagePath = `http://localhost:4300/uploads/${data.profileImagePath}`;
        this.user = data;
      },
      error: (err) => console.error('Failed to load user profile', err),
    });
  }
  saveProfile(): void {
    this.userService.updateCurrentUserProfile(this.user!).subscribe({
      next: (data) => {
        this.user = data;
        this.isEditing = false;
      },
      error: (err) => console.error('Failed to update user profile', err),
    });
  }
}
