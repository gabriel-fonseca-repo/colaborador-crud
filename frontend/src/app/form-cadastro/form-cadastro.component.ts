import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment/environment';
import { ModalCarregamentoComponent } from '../modal-carregamento/modal-carregamento.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { openSnackBar } from '../../utils/snackbar';
import { DataTableComponent } from "../data-table/data-table.component";
import { UpdateDataTableService } from '../update-data-table.service';

@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ModalCarregamentoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    DataTableComponent
],
  styleUrl: './form-cadastro.component.css',
  template: `
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <form (ngSubmit)="onSubmit(f)" #f="ngForm">
      <h3>Cadastro de colaborador</h3>

      <mat-form-field appearance="outline">
        <mat-label>Nome do colaborador</mat-label>
        <input matInput type="text" name="nome" id="nome" [(ngModel)]="nome" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Sobrenome do colaborador</mat-label>
        <input matInput type="text" name="sobrenome" id="sobrenome" [(ngModel)]="sobrenome" />
      </mat-form-field>

      <button type="submit" mat-flat-button>Cadastrar colaborador</button>
    </form>
    <app-data-table />
  `,
})
export class FormCadastroComponent {
  nome: string = 'Gabriel';
  sobrenome: string = 'Fonseca';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private updateDtService: UpdateDataTableService
  ) {}

  onSubmit(form: any) {
    this.isLoading = true;
    const url = environment.backendUrl;
    this.http
      .post(
        url + '/Colaborador',
        {
          firstName: form.value.nome,
          lastName: form.value.sobrenome,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          responseType: 'text',
        }
      )
      .subscribe({
        next: (res) => {
          openSnackBar(this.snackbar, res.body);
        },
        error: (err) => {
          openSnackBar(this.snackbar, err.error);
        },
      }).add(() => {
        this.updateDtService.notifyDataChange();
        this.isLoading = false;
      });
  }
}
