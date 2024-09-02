import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalCarregamentoComponent } from '../modal-carregamento/modal-carregamento.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-update-data-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ModalCarregamentoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  styleUrl: './update-data-dialog.component.css',
  template: `
    <h1 mat-dialog-title>Editar cadastro</h1>
    <div mat-dialog-content class="dialog-content">
      <mat-form-field>
        <mat-label>Nome do colaborador</mat-label>
        <input matInput type="text" name="nome" id="nomeDialog" [(ngModel)]="data.firstName" />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Sobrenome do colaborador</mat-label>
        <input matInput type="text" name="sobrenome" id="sobrenomeDialog" [(ngModel)]="data.lastName" />
      </mat-form-field>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="cancelUpdate()">Cancelar</button>
      <button mat-button (click)="update()" cdkFocusInitial>Atualizar</button>
    </div>
  `,
})
export class UpdateDataDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cancelUpdate(): void {
    this.dialogRef.close();
  }

  update(): void {
    this.dialogRef.close(this.data);
  }
}
