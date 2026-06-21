import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonMenuButton, IonButtons
} from '@ionic/angular/standalone';
import { VaccineService } from '../../services/vaccine.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonCard, IonCardHeader, IonCardTitle,
  IonCardContent,
  IonMenuButton, IonButtons,
  CommonModule, RouterModule
]
})
export class DashboardPage implements OnInit {
  childrenCount = 0;
  totalPending = 0;
  campaignCount = 0;

  constructor(private vaccineService: VaccineService) {}

  ngOnInit() {
    const children = this.vaccineService.getChildren();
    this.childrenCount = children.length;
    this.totalPending = children.reduce((sum, c) => sum + this.vaccineService.getPendingCount(c), 0);
    this.campaignCount = this.vaccineService.getCampaigns().length;
  }
}