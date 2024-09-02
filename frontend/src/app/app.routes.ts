import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { FormCadastroComponent } from './form-cadastro/form-cadastro.component';
import { FormBaterPontoComponent } from './form-bater-ponto/form-bater-ponto.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'cadastro', component: FormCadastroComponent },
      { path: 'ponto', component: FormBaterPontoComponent },
      { path: '*', redirectTo: '/cadastro', pathMatch: 'full' },
      { path: '**', redirectTo: '/cadastro', pathMatch: 'full' },
    ]
  }
];
