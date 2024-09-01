import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-modal-carregamento',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule, MatCardModule],
  styleUrl: './modal-carregamento.component.css',
  template: `
    <div class="overlay-carregamento" *ngIf="isLoading">
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>Carregando...</mat-card-title>
        </mat-card-header>
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </mat-card>
    </div>
  `
})
export class ModalCarregamentoComponent {
  @Input() isLoading: boolean = false;
}
