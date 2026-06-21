import { Injectable } from '@angular/core';

export interface Vaccine {
  name: string;
  scheduledDate: string;
  appliedDate: string | null;
}

export interface Child {
  id: number;
  name: string;
  cpf: string;
  age: number;
  sex: 'M' | 'F';
  vaccines: Vaccine[];
}

export interface Campaign {
  title: string;
  targetAudience: string;
  startDate: string;
  endDate: string;
}

export const PREDEFINED_VACCINES: string[] = [
  'BCG',
  'Hepatite B',
  'Pentavalente (1ª dose)',
  'Pentavalente (2ª dose)',
  'Pentavalente (3ª dose)',
  'VIP/VOP (1ª dose)',
  'VIP/VOP (2ª dose)',
  'VIP/VOP (3ª dose)',
  'Rotavírus (1ª dose)',
  'Rotavírus (2ª dose)',
  'Pneumocócica (1ª dose)',
  'Pneumocócica (2ª dose)',
  'Meningocócica C (1ª dose)',
  'Meningocócica C (2ª dose)',
  'Febre Amarela',
  'Tríplice Viral (1ª dose)',
  'Tríplice Viral (2ª dose)',
  'Varicela',
  'DTP Reforço',
  'Hepatite A',
];

const STORAGE_KEY = 'vacina_kids_children';

const DEFAULT_CHILDREN: Child[] = [
  {
    id: 1,
    name: 'Ana',
    cpf: '',
    age: 3,
    sex: 'F',
    vaccines: [
      { name: 'BCG', scheduledDate: '2021-03-01', appliedDate: '2021-03-01' },
      { name: 'Hepatite B', scheduledDate: '2021-03-01', appliedDate: '2021-03-01' },
      { name: 'Pentavalente (1ª dose)', scheduledDate: '2021-05-01', appliedDate: '2021-05-10' },
      { name: 'Tríplice Viral (1ª dose)', scheduledDate: '2022-03-01', appliedDate: '2022-03-15' },
    ]
  },
  {
    id: 2,
    name: 'Pedro',
    cpf: '',
    age: 5,
    sex: 'M',
    vaccines: [
      { name: 'BCG', scheduledDate: '2019-06-01', appliedDate: '2019-06-01' },
      { name: 'Hepatite B', scheduledDate: '2019-06-01', appliedDate: '2019-06-01' },
      { name: 'Pentavalente (1ª dose)', scheduledDate: '2019-08-01', appliedDate: '2019-08-10' },
      { name: 'Pentavalente (3ª dose)', scheduledDate: '2019-12-01', appliedDate: null },
      { name: 'Tríplice Viral (1ª dose)', scheduledDate: '2020-06-01', appliedDate: null },
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class VaccineService {

  private children: Child[] = [];

  private campaigns: Campaign[] = [
    {
      title: 'Campanha Nacional da Influenza',
      targetAudience: 'Crianças de 6 meses a 6 anos',
      startDate: '2026-05-01',
      endDate: '2026-07-31',
    }
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      this.children = JSON.parse(stored);
    } else {
      this.children = DEFAULT_CHILDREN;
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.children));
  }

  getChildren(): Child[] {
    return this.children;
  }

  getChildById(id: number): Child | undefined {
    return this.children.find(c => c.id === id);
  }

  addChild(name: string, age: number, sex: 'M' | 'F', cpf: string): void {
    const newId = this.children.length > 0
      ? Math.max(...this.children.map(c => c.id)) + 1
      : 1;
    this.children.push({ id: newId, name, cpf, age, sex, vaccines: [] });
    this.saveToStorage();
  }

  addVaccineToChild(childId: number, vaccineName: string, appliedDate: string): void {
    const child = this.getChildById(childId);
    if (child) {
      const existing = child.vaccines.find(v => v.name === vaccineName && !v.appliedDate);
      if (existing) {
        existing.appliedDate = appliedDate;
      } else {
        child.vaccines.push({
          name: vaccineName,
          scheduledDate: appliedDate,
          appliedDate: appliedDate
        });
      }
      this.saveToStorage();
    }
  }

  removeVaccineFromChild(childId: number, vaccineName: string): void {
    const child = this.getChildById(childId);
    if (child) {
      child.vaccines = child.vaccines.filter(v => v.name !== vaccineName);
      this.saveToStorage();
    }
  }

  getCampaigns(): Campaign[] {
    return this.campaigns;
  }

  getVaccineStatus(vaccine: Vaccine): 'applied' | 'overdue' | 'upcoming' {
    if (vaccine.appliedDate) return 'applied';
    const today = new Date();
    const scheduled = new Date(vaccine.scheduledDate);
    return scheduled < today ? 'overdue' : 'upcoming';
  }

  getPendingCount(child: Child): number {
    return child.vaccines.filter(v => !v.appliedDate).length;
  }

  isVaccinationUpToDate(child: Child): boolean {
    return this.getPendingCount(child) === 0;
  }

  getEmoji(sex: 'M' | 'F'): string {
    return sex === 'F' ? '👧' : '👦';
  }
  removeChild(childId: number): void {
  this.children = this.children.filter(c => c.id !== childId);
  this.saveToStorage();
}
addScheduledVaccine(childId: number, vaccineName: string, scheduledDate: string): void {
  const child = this.getChildById(childId);
  if (child) {
    child.vaccines.push({
      name: vaccineName,
      scheduledDate: scheduledDate,
      appliedDate: null
    });
    this.saveToStorage();
  }
}
resetChildren(): void {
  this.children = JSON.parse(JSON.stringify(DEFAULT_CHILDREN));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.children));
}
}