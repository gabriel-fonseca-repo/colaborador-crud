import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { FormCadastroComponent } from './form-cadastro/form-cadastro.component';
import { FormAtualizacaoComponent } from './form-atualizacao/form-atualizacao.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'cadastro', component: FormCadastroComponent },
      { path: 'atualizacao', component: FormAtualizacaoComponent },
      { path: '', redirectTo: '/cadastro', pathMatch: 'full' }
      // { path: '**', component: `` }
    ]
  }
];
