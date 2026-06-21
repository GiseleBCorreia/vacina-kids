import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton
} from '@ionic/angular/standalone';
import { VaccineService } from '../../services/vaccine.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonLabel, IonInput, IonButton,
    CommonModule, FormsModule, RouterModule
  ]
})
export class LoginPage {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private router: Router, private vaccineService: VaccineService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Preencha e-mail e senha.';
      return;
    }
    localStorage.setItem('userEmail', this.email);
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userPhoto');
    this.vaccineService.resetChildren();
    this.router.navigate(['/tabs/children']);
  }
}