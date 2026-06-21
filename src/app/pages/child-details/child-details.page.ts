import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardContent, IonButtons, IonBackButton,
  IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { VaccineService, Child, Vaccine, PREDEFINED_VACCINES } from '../../services/vaccine.service';

@Component({
  selector: 'app-child-details',
  templateUrl: './child-details.page.html',
  styleUrls: ['./child-details.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent, IonButtons, IonBackButton,
    IonButton, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    CommonModule, FormsModule
  ]
})
export class ChildDetailsPage implements OnInit {
  child: Child | undefined;
  showVaccineForm = false;
  vaccineDate = '';
  predefinedVaccines = PREDEFINED_VACCINES;
  vaccineSearch = '';
  filteredVaccines: string[] = [];
  selectedVaccine = '';
  vaccineType: 'applied' | 'scheduled' = 'applied';

  get appliedCount(): number {
    return this.child?.vaccines.filter(v => v.appliedDate).length ?? 0;
  }

  get overdueCount(): number {
    return this.child?.vaccines.filter(v => this.getStatus(v) === 'overdue').length ?? 0;
  }

  get upcomingCount(): number {
    return this.child?.vaccines.filter(v => this.getStatus(v) === 'upcoming').length ?? 0;
  }

  get totalVaccines(): number {
    return this.child?.vaccines.length ?? 0;
  }

  get progressPercent(): number {
    if (!this.totalVaccines) return 0;
    return Math.round((this.appliedCount / this.totalVaccines) * 100);
  }

  get nextVaccine() {
    return this.child?.vaccines.find(v => !v.appliedDate);
  }

  get daysUntilNext(): number {
    if (!this.nextVaccine) return 0;
    const today = new Date();
    const scheduled = new Date(this.nextVaccine.scheduledDate);
    return Math.ceil((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  constructor(
    private route: ActivatedRoute,
    private vaccineService: VaccineService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.child = this.vaccineService.getChildById(id);
  }

  toggleVaccineForm() {
    this.showVaccineForm = !this.showVaccineForm;
    this.vaccineDate = '';
    this.vaccineSearch = '';
    this.filteredVaccines = [];
    this.selectedVaccine = '';
    this.vaccineType = 'applied';
  }

  filterVaccines() {
    if (!this.vaccineSearch) {
      this.filteredVaccines = [];
      return;
    }
    this.filteredVaccines = this.predefinedVaccines.filter(v =>
      v.toLowerCase().includes(this.vaccineSearch.toLowerCase())
    );
  }

  selectVaccine(vaccine: string) {
    this.selectedVaccine = vaccine;
    this.vaccineSearch = vaccine;
    this.filteredVaccines = [];
  }

  isAlreadyApplied(vaccineName: string): boolean {
    return this.child?.vaccines.some(v => v.name === vaccineName && v.appliedDate) ?? false;
  }

  applyVaccine(vaccineName: string) {
  if (!this.vaccineDate) {
    alert('Selecione a data!');
    return;
  }
  if (!this.child) return;

  if (this.vaccineType === 'applied') {
    this.vaccineService.addVaccineToChild(this.child.id, vaccineName, this.vaccineDate);
  } else {
    this.vaccineService.addScheduledVaccine(this.child.id, vaccineName, this.vaccineDate);
  }

  this.child = this.vaccineService.getChildById(this.child.id);
  this.selectedVaccine = '';
  this.vaccineSearch = '';
  this.vaccineDate = '';
  this.vaccineType = 'applied';
}
  getStatus(vaccine: Vaccine): 'applied' | 'overdue' | 'upcoming' {
    return this.vaccineService.getVaccineStatus(vaccine);
  }

  getEmoji(sex: 'M' | 'F'): string {
    return this.vaccineService.getEmoji(sex);
  }

  removeVaccine(vaccineName: string) {
    if (!this.child) return;
    const confirmed = confirm(`Tem certeza que deseja excluir a vacina "${vaccineName}"?`);
    if (!confirmed) return;
    this.vaccineService.removeVaccineFromChild(this.child.id, vaccineName);
    this.child = this.vaccineService.getChildById(this.child.id);
  }
}