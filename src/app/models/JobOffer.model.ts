export interface JobOffer {
  id?: number; // Optionnel pour les créations
  title: string;
  description: string;
  location: string;
  contractType: string;
  experienceLevel?: string;
  publishedDate?: string;
  expirationDate?: string;
  isActive?: boolean;
  skillsRequired?: string;
  responsibilities?: string;
  benefits?: string;
}
