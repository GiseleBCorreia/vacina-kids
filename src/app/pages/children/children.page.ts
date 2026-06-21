import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonButtons, IonButton, IonIcon,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { VaccineService, Child } from '../../services/vaccine.service';

@Component({
  selector: 'app-children',
  templateUrl: './children.page.html',
  styleUrls: ['./children.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButtons, IonButton, IonIcon,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    CommonModule, FormsModule, RouterModule
  ]
})
export class ChildrenPage implements OnInit {
  children: Child[] = [];
  showForm = false;
  newName = '';
  newBirthDate = '';
  newSex: 'M' | 'F' = 'F';
  newCpf = '';
  searchCpf = '';
  filteredChildren: Child[] = [];
  openOptionsId: number | null = null;

  constructor(private vaccineService: VaccineService, private router: Router) {
    addIcons({ addOutline });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.newName = '';
    this.newBirthDate = '';
    this.newSex = 'F';
    this.newCpf = '';
  }

  saveChild() {
    if (!this.newName || !this.newBirthDate || !this.newCpf) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    const age = this.calcAge(this.newBirthDate);
    this.vaccineService.addChild(this.newName, age, this.newSex, this.newCpf);
    this.children = this.vaccineService.getChildren();
    this.filteredChildren = this.children;
    this.toggleForm();
  }

  calcAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  filterChildren() {
    if (!this.searchCpf) {
      this.filteredChildren = this.children;
      return;
    }
    this.filteredChildren = this.children.filter(c =>
      c.cpf.includes(this.searchCpf)
    );
  }

  navigateToChild(childId: number) {
    this.router.navigate(['/tabs/child-details', childId]);
  }

  toggleChildOptions(event: Event, childId: number) {
    event.stopPropagation();
    this.openOptionsId = this.openOptionsId === childId ? null : childId;
  }

  removeChild(event: Event, childId: number) {
    event.stopPropagation();
    const child = this.children.find(c => c.id === childId);
    const confirmed = confirm(`Tem certeza que deseja remover ${child?.name}?`);
    if (!confirmed) return;
    this.vaccineService.removeChild(childId);
    this.children = this.vaccineService.getChildren();
    this.filteredChildren = this.children;
    this.openOptionsId = null;
  }

  isUpToDate(child: Child): boolean {
    return this.vaccineService.isVaccinationUpToDate(child);
  }

  getPending(child: Child): number {
    return this.vaccineService.getPendingCount(child);
  }

  getEmoji(sex: 'M' | 'F'): string {
    return this.vaccineService.getEmoji(sex);
  }
  ngOnInit() {
  this.children = this.vaccineService.getChildren();
  this.filteredChildren = [...this.children];
}
}