import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';

export interface AddColaboradorDTO {
  nome: string;
  sobrenome: string;
  matricula: string;
  cargo: number;
  salario: number;
}

export interface CargosEnum {
  value: number;
  viewValue: string;
}

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
    DataTableComponent,
    MatSelectModule,
    ReactiveFormsModule
],
  styleUrl: './form-cadastro.component.css',
  template: `
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>

    <form [formGroup]="cadastroColaboradorForm" (ngSubmit)="onSubmit()">
      <h3>Cadastro de colaborador</h3>

      <div class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>Nome do colaborador</mat-label>
          <input matInput type="text" formControlName="nome" name="nome" id="nome" />
          <mat-hint align="end">O nome deve começar com letra maiúscula, e conter apenas letras do alfabeto.</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Sobrenome do colaborador</mat-label>
          <input matInput type="text" formControlName="sobrenome" name="sobrenome" id="sobrenome" />
          <mat-hint align="end">O sobrenome deve começar com letra maiúscula, e conter apenas letras do alfabeto.</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Matrícula</mat-label>
          <input matInput type="text" maxlength="6" formControlName="matricula" name="matricula" id="matricula" />
          <mat-hint align="end">Código de no máximo 6 dígitos.</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cargo</mat-label>
          <mat-select formControlName="cargo" name="cargo" id="cargo" >
            @for (cargo of cargos; track cargo) {
              <mat-option [value]="cargo.value">{{cargo.viewValue}}</mat-option>
            }
          </mat-select>
          <mat-hint align="end">Valor deve ser maior que R$ 1,00.</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Salário</mat-label>
          <input matInput type="number" formControlName="salario" name="salario" id="salario" />
          <span matTextPrefix>R$&nbsp;</span>
          <span matTextSuffix>,00</span>
        </mat-form-field>
      </div>

      <button type="submit" mat-flat-button [disabled]="!cadastroColaboradorForm.valid">Cadastrar colaborador</button>
    </form>
    <app-data-table />
  `,
})
export class FormCadastroComponent implements OnInit{
  cadastroColaboradorForm = new FormGroup({
    nome: new FormControl('Gabriel', [Validators.required, Validators.pattern("^[A-Z][a-z]*$")]),
    sobrenome: new FormControl('Fonseca', [Validators.required, Validators.pattern("^[A-Z][a-z]*$")]),
    matricula: new FormControl('211111', [Validators.required, Validators.maxLength(6), Validators.pattern("^[0-9]{6}$")]),
    cargo: new FormControl(3, [Validators.required]),
    salario: new FormControl(3000, [Validators.required])
  });

  cargos: CargosEnum[] = [
    {value: 1, viewValue: 'Steak'}
  ];

  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private updateDtService: UpdateDataTableService
  ) {}

  ngOnInit(): void {
    this.fetchCargos();
  }

  fetchCargos() {
    this.isLoading = true;
    const url = environment.backendUrl;
    this.http
      .get(
        url + '/Colaborador/Cargos',
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          responseType: 'json',
        }
      )
      .subscribe({
        next: (res) => {
          this.cargos = res.body as CargosEnum[];
        },
        error: (err) => {
          openSnackBar(this.snackbar, err.error);
        },
      }).add(() => {
        this.isLoading = false;
      });
  }

  onSubmit() {
    this.isLoading = true;
    if (!this.cadastroColaboradorForm.valid) {
      this.isLoading = false;
      return;
    }
    const url = environment.backendUrl;
    this.http.post(
        url + '/Colaborador',
        JSON.stringify(this.cadastroColaboradorForm.value),
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          responseType: 'text',
        }
      )
      .subscribe({
        next: (res) => {
          console.log(res.body);
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

