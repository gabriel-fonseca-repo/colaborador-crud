import { Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalCarregamentoComponent } from '../modal-carregamento/modal-carregamento.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-generate-relatorio-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ModalCarregamentoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  template: `
    <form (ngSubmit)="downloadRelatorio()">
      <h1 mat-dialog-title>Gerar relatório</h1>
      <div mat-dialog-content class="dialog-content">
        <mat-form-field appearance="outline">
          <mat-label>Mês e ano</mat-label>
          <input matInput [matDatepicker]="dp" [formControl]="data.date">
          <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
          <mat-datepicker #dp startView="multi-year">
          </mat-datepicker>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-flat-button type="submit" [disabled]="!this.data.date.valid">Baixar</button>
      </div>
    </form>
  `,
  styleUrl: './generate-relatorio-dialog.component.css'
})
export class GenerateRelatorioDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GenerateRelatorioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      date: FormControl<Date>,
    }
  ) {}

  cancelUpdate(): void {
    this.dialogRef.close();
  }

  downloadRelatorio(): void {
    if (this.data.date.valid) {
      this.dialogRef.close(this.data.date.value);
    }
  }
}
