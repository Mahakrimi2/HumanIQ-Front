import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  constructor() {}
  private colors = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F333FF',
    '#FF33A8',
    '#33FFF5',
    '#8F33FF',
    '#FF8F33',
  ];

  generateAvatar(name: string): {
    initial: string;
    color: string;
  } {
    const initial = name?.charAt(0)?.toUpperCase() || '?';
    const charCode = name?.charCodeAt(0) || 0;
    const color = this.colors[charCode % this.colors.length];

    return {
      initial,
      color,
    };
  }
}
