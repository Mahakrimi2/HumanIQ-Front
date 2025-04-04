import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor() {}
  private darkColors = [
    '#2c3e50', // Noir bleuté très foncé
    '#34495e', // Noir bleuté foncé
    '#1a237e', // Bleu indigo foncé
    '#0d47a1', // Bleu marine
    '#263238', // Gris anthracite
    '#212121', // Noir profond
    '#311b92', // Violet très foncé
    '#1a3e72', // Bleu foncé intense
  ];

  generateAvatar(name: string): { initial: string; color: string } {
    const initial = name?.charAt(0)?.toUpperCase() || '?';
    const charCode = name?.charCodeAt(0) || 0;
    const color = this.darkColors[charCode % this.darkColors.length];

    return { initial, color };
  }

  getAvatarColor(fullname: string): string {
    const charCode = fullname?.charCodeAt(0) || 0;
    return this.darkColors[charCode % this.darkColors.length];
  }
}
