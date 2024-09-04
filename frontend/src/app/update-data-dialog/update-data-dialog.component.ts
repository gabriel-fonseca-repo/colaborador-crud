import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalCarregamentoComponent } from '../modal-carregamento/modal-carregamento.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CargosEnum } from '../form-cadastro/form-cadastro.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-data-dialog',
  standalone: true,
  imports: [
    FormsModule,
    ModalCarregamentoComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  styleUrl: './update-data-dialog.component.css',
  template: `
    <form [formGroup]="data.colaboradorData" (ngSubmit)="update()">
      <h1 mat-dialog-title>Editar cadastro</h1>
      <div mat-dialog-content class="dialog-content">
        <div class="form-fields">
          <mat-form-field>
            <mat-label>Nome do colaborador</mat-label>
            <input matInput type="text" formControlName="updateNome" name="updateNome" id="updateNome" />
            <mat-hint align="end">O nome deve começar com letra maiúscula, e conter apenas letras do alfabeto.</mat-hint>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Sobrenome do colaborador</mat-label>
            <input matInput type="text" formControlName="updateSobrenome" name="updateSobrenome" id="updateSobrenome" />
            <mat-hint align="end">O sobrenome deve começar com letra maiúscula, e conter apenas letras do alfabeto.</mat-hint>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Matrícula</mat-label>
            <input matInput type="text" maxlength="6" formControlName="updateMatricula" name="updateMatricula" id="updateMatricula" />
            <mat-hint align="end">Código de no máximo 6 dígitos.</mat-hint>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Cargo</mat-label>
            <mat-select formControlName="updateCargo" name="updateCargo" id="updateCargo" >
              @for (cargo of data.cargos; track cargo) {
                <mat-option [value]="cargo.value">{{cargo.viewValue}}</mat-option>
              }
            </mat-select>
            <mat-hint align="end">Valor deve ser maior que R$ 1,00.</mat-hint>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Salário</mat-label>
            <input matInput type="number" formControlName="updateSalario" name="updateSalario" id="updateSalario" />
            <span matTextPrefix>R$&nbsp;</span>
            <span matTextSuffix>,00</span>
          </mat-form-field>
        </div>
      </div>
      <div mat-dialog-actions>
        <button mat-flat-button type="button" (click)="cancelUpdate()">Cancelar</button>
        <button mat-flat-button type="submit" [disabled]="!formChanged || !this.data.colaboradorData.valid">Atualizar</button>
      </div>
    </form>
  `,
})
export class UpdateDataDialogComponent implements OnInit {

  formChanged: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UpdateDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      colaboradorData: FormGroup<{
        updateId: FormControl<number>;
        updateNome: FormControl<string>;
        updateSobrenome: FormControl<string>;
        updateMatricula: FormControl<string>;
        updateCargo: FormControl<number>;
        updateSalario: FormControl<number>;
      }>;
      cargos: CargosEnum[];
    }
  ) {}

  ngOnInit(): void {
    this.data.colaboradorData.valueChanges.subscribe(() => {
      this.formChanged = this.data.colaboradorData.dirty;
    });
  }

  cancelUpdate(): void {
    this.dialogRef.close();
  }

  update(): void {
    if (this.data.colaboradorData.valid && this.formChanged) {
      this.dialogRef.close(this.data.colaboradorData.value);
    }
  }
}
