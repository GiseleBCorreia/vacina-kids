import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton
} from '@ionic/angular/standalone';
import { VaccineService } from '../../services/vaccine.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, IonLabel, IonInput, IonButton,
    CommonModule, FormsModule, RouterModule
  ]
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';
  errorMsg = '';

  constructor(private router: Router, private vaccineService: VaccineService) {}

  register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMsg = 'Preencha todos os campos.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMsg = 'As senhas não coincidem.';
      return;
    }
    localStorage.setItem('userEmail', this.email);
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userPhoto');
    this.vaccineService.resetChildren();
    this.router.navigate(['/tabs/children']);
  }
}