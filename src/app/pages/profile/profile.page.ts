import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonCard, IonCardContent,
  IonButton, IonItem, IonLabel, IonInput
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonCard, IonCardContent,
    IonButton, IonItem, IonLabel, IonInput,
    CommonModule, FormsModule, RouterModule
  ]
})
export class ProfilePage implements OnInit {
  nickname = 'Mamãe';
  email = '';
  photoUrl = '';
  editingName = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.email = localStorage.getItem('userEmail') || '';
    this.nickname = localStorage.getItem('userNickname') || 'Mamãe';
    this.photoUrl = localStorage.getItem('userPhoto') || '';
  }

  saveName() {
    localStorage.setItem('userNickname', this.nickname);
    this.editingName = false;
  }

  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoUrl = e.target.result;
      localStorage.setItem('userPhoto', this.photoUrl);
    };
    reader.readAsDataURL(file);
  }

  logout() {
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userNickname');
  localStorage.removeItem('userPhoto');
  localStorage.removeItem('vacina_kids_children');
  this.router.navigate(['/welcome']);
}
}