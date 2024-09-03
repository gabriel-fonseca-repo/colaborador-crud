import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { ModalCarregamentoComponent } from "../modal-carregamento/modal-carregamento.component";
import { environment } from '../../environment/environment';
import { openSnackBar } from '../../utils/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDataTableService } from '../update-data-table.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDataDialogComponent } from '../update-data-dialog/update-data-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { BrlFormatPipe } from '../brl-format.pipe';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CargosEnum } from '../form-cadastro/form-cadastro.component';

export interface GetColaboradorDTO {
  id: number;
  nomeCompleto: string;
  nome: string;
  sobrenome: string;
  matricula: string;
  cargo: number;
  salario: number;
}

export interface PaginateColaboradoresDTO {
  count: number;
  colaboradores: GetColaboradorDTO[];
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    ModalCarregamentoComponent,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    BrlFormatPipe
  ],
  styleUrl: './data-table.component.css',
  template: `
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <table mat-table matSort [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell mat-sort-header *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.id}} </td>
      </ng-container>
      <ng-container matColumnDef="nome">
        <th mat-header-cell *matHeaderCellDef> Nome </th>
        <td mat-cell *matCellDef="let element"> {{element.nome}} </td>
      </ng-container>
      <ng-container matColumnDef="sobrenome">
        <th mat-header-cell *matHeaderCellDef> Sobrenome </th>
        <td mat-cell *matCellDef="let element"> {{element.sobrenome}} </td>
      </ng-container>
      <ng-container matColumnDef="nomeCompleto">
        <th mat-header-cell *matHeaderCellDef> Nome completo </th>
        <td mat-cell *matCellDef="let element"> {{element.nomeCompleto}} </td>
      </ng-container>
      <ng-container matColumnDef="matricula">
        <th mat-header-cell *matHeaderCellDef> Matrícula </th>
        <td mat-cell *matCellDef="let element"> {{element.matricula}} </td>
      </ng-container>
      <ng-container matColumnDef="cargo">
        <th mat-header-cell *matHeaderCellDef> Cargo </th>
        <td mat-cell *matCellDef="let element"> {{getCargoNome(element.cargo)}} </td>
      </ng-container>
      <ng-container matColumnDef="salario">
        <th mat-header-cell *matHeaderCellDef> Salário </th>
        <td mat-cell *matCellDef="let element"> {{element.salario | brlFormat:'BRL'}} </td>
      </ng-container>
      <ng-container matColumnDef="delete">
        <th mat-header-cell *matHeaderCellDef> Deletar </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="deleteItem(element.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>
      <ng-container matColumnDef="update">
        <th mat-header-cell *matHeaderCellDef> Atualizar </th>
        <td mat-cell *matCellDef="let element">
          <button mat-icon-button (click)="updateItem(element)">
            <mat-icon>edit</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator [length]="totalColaboradores"
                   [pageIndex]="0"
                   [pageSize]="10"
                   [pageSizeOptions]="[5, 10, 20]"
                   (page)="loadColaboradores()"
                   showFirstLastButtons>
  `,
})
export class DataTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'nome',
    'sobrenome',
    'nomeCompleto',
    'matricula',
    'cargo',
    'salario',
    'delete',
    'update',
  ];
  dataSource = new MatTableDataSource<GetColaboradorDTO>([]);

  updateColaboradorForm = new FormGroup({
    updateId: new FormControl(0, [Validators.required]),
    updateNome: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-z]*$")]),
    updateSobrenome: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-z]*$")]),
    updateMatricula: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern("^[0-9]{6}$")]),
    updateCargo: new FormControl(0, [Validators.required]),
    updateSalario: new FormControl(0, [Validators.required])
  });

  cargos: CargosEnum[] = [
    {value: 1, viewValue: 'Steak'}
  ];

  isLoading = false;
  totalColaboradores = 0;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private updateDtService: UpdateDataTableService,
    public dialog: MatDialog
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  ngAfterViewInit() {
    this.loadColaboradores();
    this.updateDtService.refreshNeeded.subscribe(() => {
      this.loadColaboradores();
    });
    this.changeDetectorRef.detectChanges();
    this.fetchCargos();
  }

  getCargoNome(valor: number): string {
    const cargo = this.cargos.find(c => c.value === valor);
    return cargo ? cargo.viewValue : 'Cargo desconhecido';
  }

  loadColaboradores() {
    this.isLoading = true;
    const url = environment.backendUrl;
    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;
    this.http
      .get(url + `/Colaborador/${pageIndex}/${pageSize}`,
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          responseType: 'json',
        })
      .subscribe({
        next: (res) => {
          let response = res.body as PaginateColaboradoresDTO;
          this.dataSource.data = response.colaboradores;
          this.totalColaboradores = response.count;
        },
        error: (err) => {
          if (err.status === 0) {
            openSnackBar(this.snackbar, 'Erro ao se conectar com o servidor.');
            return;
          }
          openSnackBar(this.snackbar, err.error);
        },
      }).add(() => {
        this.isLoading = false;
      });
  }

  deleteItem(id: number) {
    this.isLoading = true;
    const url = environment.backendUrl;
    this.http
      .delete(url + `/Colaborador/${id}`,
        {
          headers: { 'Content-Type': 'application/json' },
          observe: 'response',
          responseType: 'text',
        })
      .subscribe({
        next: (res) => {
          let response = res.body as string;
          openSnackBar(this.snackbar, response);
        },
        error: (err) => {
          openSnackBar(this.snackbar, err.error);
        },
      }).add(() => {
        this.updateDtService.notifyDataChange();
        this.isLoading = false;
      });
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


  updateItem(element: GetColaboradorDTO) {

    console.log(element);

    this.updateColaboradorForm.setValue({
      updateId: element.id,
      updateNome: element.nome,
      updateSobrenome: element.sobrenome,
      updateMatricula: element.matricula,
      updateCargo: element.cargo,
      updateSalario: element.salario
    });

    const dialogRef = this.dialog.open(UpdateDataDialogComponent, {
      data: { colaboradorData: this.updateColaboradorForm, cargos: this.cargos }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const url = environment.backendUrl;
        let transposedResult = {
          id: result.updateId,
          nome: result.updateNome,
          sobrenome: result.updateSobrenome,
          matricula: result.updateMatricula,
          cargo: result.updateCargo,
          salario: result.updateSalario
        }
        this.http
        .put(url + `/Colaborador/${transposedResult.id}`,
          JSON.stringify(transposedResult),
          {
            headers: { 'Content-Type': 'application/json' },
            observe: 'response',
            responseType: 'text',
          })
        .subscribe({
          next: (res) => {
            let response = res.body as string;
            openSnackBar(this.snackbar, response);
          },
          error: (err) => {
            openSnackBar(this.snackbar, err.error);
          },
        }).add(() => {
          this.updateDtService.notifyDataChange();
          this.isLoading = false;
        });
      }
    });
  }

}
