import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then(m => m.TabsPage),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'children',
        loadComponent: () => import('./pages/children/children.page').then(m => m.ChildrenPage)
      },
      {
        path: 'child-details/:id',
        loadComponent: () => import('./pages/child-details/child-details.page').then(m => m.ChildDetailsPage)
      },
      {
        path: 'campaigns',
        loadComponent: () => import('./pages/campaigns/campaigns.page').then(m => m.CampaignsPage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.page').then(m => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'children',
        pathMatch: 'full'
      }
    ]
  },
  {
  path: 'register',
  loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
},
];