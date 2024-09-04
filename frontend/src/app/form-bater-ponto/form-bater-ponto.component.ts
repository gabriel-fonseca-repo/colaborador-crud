import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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
import { MatDialog } from '@angular/material/dialog';
import { GenerateRelatorioDialogComponent } from '../generate-relatorio-dialog/generate-relatorio-dialog.component';
import { UpdateColaboradorDataTableService } from '../update-colaborador-data-table.service';

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
              (keyup)="consultarColaboradores()">
        <mat-autocomplete requireSelection #auto="matAutocomplete" (optionSelected)="consultarPontosColaborador()">
          @for (colaborador of colaboradoresFiltrados; track colaboradoresFiltrados) {
            <mat-option [value]="colaborador.campoAutocomplete">{{colaborador.campoAutocomplete}}</mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
      <button type="submit" mat-flat-button [disabled]="!inputColaboradorControl.valid">Bater ponto</button>
      <button type="button" mat-flat-button (click)="gerarRelatorio()">Relatório</button>
    </form>
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <table mat-table matSort [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell mat-sort-header *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.id}} </td>
      </ng-container>
      <ng-container matColumnDef="horarioDataEntrada">
        <th mat-header-cell *matHeaderCellDef> Entrada </th>
        <td mat-cell *matCellDef="let element"> {{element.horarioDataEntrada | date: 'dd/MM/yyyy HH:mm'}} </td>
      </ng-container>
      <ng-container matColumnDef="horarioDataSaida">
        <th mat-header-cell *matHeaderCellDef> Saída </th>
        <td mat-cell *matCellDef="let element"> {{element.horarioDataSaida | date: 'dd/MM/yyyy HH:mm'}} </td>
      </ng-container>
      <ng-container matColumnDef="ativo">
        <th mat-header-cell *matHeaderCellDef> Ativo </th>
        <td mat-cell *matCellDef="let element"> {{element.ativo ? "Sim" : "Não"}} </td>
      </ng-container>
      <ng-container matColumnDef="update">
        <th mat-header-cell *matHeaderCellDef> Pausar/Despausar </th>
        <td mat-cell *matCellDef="let element">
          @if (!isPontoPausado(element)) {
            <button mat-icon-button (click)="pausarPonto(element)" disabled="{{!element.ativo}}">
              <mat-icon>pause</mat-icon>
            </button>
          } @else if (isPontoPausado(element)) {
            <button mat-icon-button (click)="despausarPonto(element)" disabled="{{!element.ativo}}">
              <mat-icon>play_arrow</mat-icon>
            </button>
          }
        </td>
      </ng-container>
      <ng-container matColumnDef="finalize">
        <th mat-header-cell *matHeaderCellDef> Bater saída </th>
        <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="baterPontoSaida()" disabled="{{!element.ativo}}">
              <mat-icon>block</mat-icon>
            </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-paginator [length]="totalPontos"
                   [pageIndex]="0"
                   [pageSize]="10"
                   [pageSizeOptions]="[5, 10, 20]"
                   (page)="consultarPontosColaborador()"
                   showFirstLastButtons>
  `
})
export class FormBaterPontoComponent implements AfterViewInit {

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
    'update',
    'finalize'
  ];
  dataSource = new MatTableDataSource<GetPontosColaboradorDTO>([]);

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private updateDtService: UpdateColaboradorDataTableService,
    public dialog: MatDialog
  ) {
  }

  ngAfterViewInit() {
    this.updateDtService.refreshNeeded.subscribe(() => {
      this.consultarPontosColaborador();
    });
  }

  isPontoPausado(ponto: GetPontosColaboradorDTO) {
    return ponto.pausas.some(p => p.ativa);
  }

  pausarPonto(element: any) {
    const url = environment.backendUrl;

    this.isLoading = true;
    this.http
    .post(url + `/Pontos/Pausar/${element.id}`,
      null,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'text'
      })
    .subscribe({
      next: (res) => {
        openSnackBar(this.snackbar, res.body);
        this.consultarPontosColaborador();
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.updateDtService.notifyDataChange();
      this.isLoading = false;
    });
  }

  despausarPonto(element: any) {
    const url = environment.backendUrl;

    this.isLoading = true;
    this.http
    .put(url + `/Pontos/Despausar/${element.id}`,
      null,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
        responseType: 'text'
      })
    .subscribe({
      next: (res) => {
        openSnackBar(this.snackbar, res.body);
        this.consultarPontosColaborador();
      },
      error: (err) => {
        openSnackBar(this.snackbar, err.error);
      }
    }).add(() => {
      this.updateDtService.notifyDataChange();
      this.isLoading = false;
    });
  }

  consultarPontosColaborador() {
    const url = environment.backendUrl;

    if (!this.inputColaboradorControl.valid) {
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
      this.updateDtService.notifyDataChange();
      this.isLoading = false;
    });
  }

  baterPontoSaida() {
    const url = environment.backendUrl;

    if (!this.inputColaboradorControl.valid) {
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

    this.http.put(url + `/Pontos/Bater/${idColaborador}`,
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
      this.updateDtService.notifyDataChange();
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

  gerarRelatorio() {

    const dialogRef = this.dialog.open(GenerateRelatorioDialogComponent, {
      data: { date: new FormControl<Date>(new Date(), [Validators.required]) },
    });

    const salvarArquivoFunc = (data: Blob, filename: string) => {
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(data);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result = result as Date;

        let mes = result.getMonth() + 1;
        let ano = result.getFullYear();

        this.isLoading = true;
        const url = environment.backendUrl;

        this.http
        .get(url + `/Colaborador/Relatorio/${ano}/${mes}`,
          {
            headers: { 'Content-Type': 'application/json' },
            observe: 'response',
            responseType: 'blob',
          })
        .subscribe({
          next: (blob) => {
            if (blob.body) {
              salvarArquivoFunc(blob.body, `Relatorio_${mes}_${ano}.csv`);
            }
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
