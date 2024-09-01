import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environment/environment';
import { ModalCarregamentoComponent } from '../modal-carregamento/modal-carregamento.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [
    FormsModule,
    ModalCarregamentoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  styleUrl: './form-cadastro.component.css',
  template: `
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <form (ngSubmit)="onSubmit(f)" #f="ngForm">
      <h3>Cadastro de colaborador</h3>

      <mat-form-field appearance="outline">
        <mat-label>Nome do colaborador</mat-label>
        <input matInput type="text" name="nome" id="nome">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Sobrenome do colaborador</mat-label>
        <input matInput type="text" name="sobrenome" id="sobrenome">
      </mat-form-field>

      <button type="submit" mat-flat-button>Cadastrar colaborador</button>
    </form>
  `
})
export class FormCadastroComponent {
  isLoading = false;

  constructor(private http: HttpClient) { }

  onSubmit(form: any) {
    this.isLoading = true;
    const url = environment.backendUrl;
    this.http.post(url + "/Colaborador", {
      "firstName": form.value.nome,
      "lastName": form.value.sobrenome
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    .subscribe({
      next: (res) => {
        console.log('Dados enviados com sucesso', res)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao enviar dados', err)
        this.isLoading = false;
      }
    });
  }
}
