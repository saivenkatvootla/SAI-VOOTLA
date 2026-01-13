
export interface GenericAlternative {
  name: string;
  priceRange: string;
}

export interface MedicineInfo {
  name: string;
  brandName: string;
  genericName: string;
  activeIngredients: string[];
  indications: string;
  dosageInstructions: string;
  sideEffects: string[];
  genericAlternatives: GenericAlternative[];
  fdaStatus: string;
}

export interface Reminder {
  id: string;
  medicineName: string;
  time: string; // HH:mm
  dosage: string;
  days: string[]; // ['Monday', 'Tuesday', ...]
  lastNotified?: string; // ISO string
}

export enum ViewState {
  HOME = 'HOME',
  SCAN = 'SCAN',
  SEARCH = 'SEARCH',
  REMINDERS = 'REMINDERS',
  DETAILS = 'DETAILS'
}

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Mandarin' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'bn', name: 'Bengali' }
];
