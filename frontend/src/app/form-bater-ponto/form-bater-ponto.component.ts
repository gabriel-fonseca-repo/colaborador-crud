import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { openSnackBar } from '../../utils/snackbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalCarregamentoComponent } from "../modal-carregamento/modal-carregamento.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface GetAutocompleteDTO {
  id: number;
  campoAutocomplete: string;
}

export interface GetPausasDTO {
  id: number;
  inicio: Date;
  fim: Date;
  ativa: boolean;
}

export interface GetPontosColaboradorDTO {
  id: number;
  horarioDataEntrada: Date;
  horarioDataSaida: Date;
  ativo: boolean;
  pausas: GetPausasDTO[];
}

export interface PaginatePontosColaboradorDTO {
  count: number;
  pontos: GetPontosColaboradorDTO[];
}


@Component({
  selector: 'app-form-bater-ponto',
  styleUrl: './form-bater-ponto.component.css',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    ModalCarregamentoComponent,
    DatePipe
],
  template: `
    <form (ngSubmit)="baterPonto()">
      <mat-form-field appearance="outline">
        <mat-label>Colaborador</mat-label>
        <input #input
              type="text"
              placeholder="Selecione um colaborador."
              matInput
              [formControl]="inputColaboradorControl"
              [matAutocomplete]="auto"
              (input)="consultarColaboradores()"
              (focus)="consultarColaboradores()">
        <mat-autocomplete requireSelection #auto="matAutocomplete">
          @for (colaborador of colaboradoresFiltrados; track colaboradoresFiltrados) {
            <mat-option [value]="colaborador.campoAutocomplete">{{colaborador.campoAutocomplete}}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
      <button type="submit" mat-flat-button [disabled]="!inputColaboradorControl.valid">Bater ponto</button>
    </form>
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <table mat-table matSort [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell mat-sort-header *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.id}} </td>
      </ng-container>
      <ng-container matColumnDef="horarioDataEntrada">
        <th mat-header-cell *matHeaderCellDef> Entrada </th>
        <td mat-cell *matCellDef="let element"> {{element.horarioDataEntrada | date: 'dd/MM/yyyy HH:mm:ss'}} </td>
      </ng-container>
      <ng-container matColumnDef="horarioDataSaida">
        <th mat-header-cell *matHeaderCellDef> Saída </th>
        <td mat-cell *matCellDef="let element"> {{element.horarioDataSaida | date: 'dd/MM/yyyy HH:mm:ss'}} </td>
      </ng-container>
      <ng-container matColumnDef="ativo">
        <th mat-header-cell *matHeaderCellDef> Ativo </th>
        <td mat-cell *matCellDef="let element"> {{element.ativo}} </td>
      </ng-container>
      <ng-container matColumnDef="update">
        <th mat-header-cell *matHeaderCellDef> Pausar/Despausar </th>
        <td mat-cell *matCellDef="let element">
        @if (element.ativo) {
          <button mat-icon-button (click)="pausarPonto(element)">
            <mat-icon>pause</mat-icon>
          </button>
        } @else {
          <button mat-icon-button (click)="despausarPonto(element)">
            <mat-icon>unpause</mat-icon>
          </button>
        }
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator [length]="totalPontos"
                   [pageIndex]="0"
                   [pageSize]="10"
                   [pageSizeOptions]="[5, 10, 20]"
                   (page)="loadPontos()"
                   showFirstLastButtons>
  `
})
export class FormBaterPontoComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('input') inputColaborador: ElementRef<HTMLInputElement>;

  inputColaboradorControl = new FormControl('', [Validators.required]);
  colaboradoresFiltrados: GetAutocompleteDTO[];
  isFilteringStill = false;
  isLoading = false;
  totalPontos = 0;

  displayedColumns: string[] = [
    'id',
    'horarioDataEntrada',
    'horarioDataSaida',
    'ativo',
    'update'
  ];
  dataSource = new MatTableDataSource<GetPontosColaboradorDTO>([]);

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) {
  }

  fetchPontosColaborador(element: any) {
    const url = environment.backendUrl;

    this.isLoading = true;
    this.http
    .get(url + `/Pontos/${element.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'json'
      })
    .subscribe({
      next: (res) => {
        this.dataSource.data = res.body as GetPontosColaboradorDTO[];
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  pausarPonto(element: any) {
    const url = environment.backendUrl;

    this.isLoading = true;
    this.http
    .post(url + `/Pontos/Pausar/${element.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'json'
      })
    .subscribe({
      next: (res) => {
        openSnackBar(this.snackbar, 'Ponto pausado com sucesso.');
        this.fetchPontosColaborador(element);
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  despausarPonto(element: any) {
    const url = environment.backendUrl;

    this.isLoading = true;
    this.http
    .post(url + `/Pontos/Despausar/${element.id}`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'json'
      })
    .subscribe({
      next: (res) => {
        openSnackBar(this.snackbar, 'Ponto despausado com sucesso.');
        this.fetchPontosColaborador(element);
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  loadPontos() {
    const url = environment.backendUrl;

    if (!this.inputColaboradorControl.valid) {
      openSnackBar(this.snackbar, 'Selecione um colaborador.');
      return;
    }

    this.isLoading = true;
    let idColaborador = this.colaboradoresFiltrados.find(c => {
      return c.campoAutocomplete === this.inputColaboradorControl.value;
    })?.id;

    if (!idColaborador) {
      openSnackBar(this.snackbar, 'Colaborador não encontrado.');
      return;
    }

    const pageIndex = this.paginator.pageIndex;
    const pageSize = this.paginator.pageSize;

    this.http.get(url + `/Pontos/${idColaborador}/${pageIndex}/${pageSize}`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'json'
      })
    .subscribe({
      next: (res) => {
        let responseData = res.body as PaginatePontosColaboradorDTO;
        this.totalPontos = responseData.count;
        this.dataSource.data = responseData.pontos;
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  baterPonto() {
    const url = environment.backendUrl;

    if (!this.inputColaboradorControl.valid) {
      openSnackBar(this.snackbar, 'Selecione um colaborador.');
      return;
    }

    this.isLoading = true;
    let idColaborador = this.colaboradoresFiltrados.find(c => {
      return c.campoAutocomplete === this.inputColaboradorControl.value;
    })?.id;

    if (!idColaborador) {
      openSnackBar(this.snackbar, 'Colaborador não encontrado.');
      return;
    }

    this.http.post(url + `/Pontos/Bater/${idColaborador}`,
      null,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'text'
      })
    .subscribe({
      next: (res) => {
        openSnackBar(this.snackbar, res.body);
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.isLoading = false;
    });
  }

  consultarColaboradores() {
    const url = environment.backendUrl;

    const filterValue = this.inputColaborador.nativeElement.value.toLowerCase();
    if (!filterValue || this.isFilteringStill) return;

    this.isFilteringStill = true;

    this.http
    .get(url + `/Colaborador/Autocomplete`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'json',
        params: { 'filter': filterValue }
      })
    .subscribe({
      next: (res) => {
        this.colaboradoresFiltrados = res.body as GetAutocompleteDTO[];
        this.isFilteringStill = false;
      },
      error: (err) => {
        openSnackBar(this.snackbar, "Erro ao buscar colaboradores.");
        this.isFilteringStill = false;
      }
    });
  }

}
