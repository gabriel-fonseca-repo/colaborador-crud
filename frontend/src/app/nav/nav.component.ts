import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  styleUrl: './nav.component.css',
  template: `
    <nav>
      <a mat-flat-button routerLink="/cadastro" routerLinkActive="active" [disabled]="isActive('/cadastro')">Cadastro</a>
      <a mat-flat-button routerLink="/atualizacao" routerLinkActive="active" [disabled]="isActive('/atualizacao')">Atualização</a>
      <a mat-flat-button routerLink="/ponto" routerLinkActive="active" [disabled]="isActive('/ponto')">Bater ponto</a>
    </nav>
  `
})
export class NavComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  isActive(routePath: string): boolean {
    return this.router.isActive(this.router.createUrlTree([routePath]), {
      paths: 'exact',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored'
    });
  }
}
