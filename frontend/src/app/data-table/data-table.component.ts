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

export interface GetColaboradorDTO {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
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
    MatSortModule
  ],
  styleUrl: './data-table.component.css',
  template: `
    <app-modal-carregamento [isLoading]="isLoading"></app-modal-carregamento>
    <table mat-table matSort [dataSource]="dataSource" class="mat-elevation-z8">
      <ng-container matColumnDef="id">
        <th mat-header-cell mat-sort-header *matHeaderCellDef> ID </th>
        <td mat-cell *matCellDef="let element"> {{element.id}} </td>
      </ng-container>
      <ng-container matColumnDef="firstName">
        <th mat-header-cell *matHeaderCellDef> Nome </th>
        <td mat-cell *matCellDef="let element"> {{element.firstName}} </td>
      </ng-container>
      <ng-container matColumnDef="lastName">
        <th mat-header-cell *matHeaderCellDef> Sobrenome </th>
        <td mat-cell *matCellDef="let element"> {{element.lastName}} </td>
      </ng-container>
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Nome completo </th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
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
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'name', 'delete', 'update'];
  dataSource = new MatTableDataSource<GetColaboradorDTO>([]);

  isLoading = false;
  totalColaboradores = 0;

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
  }

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef,
    private updateDtService: UpdateDataTableService,
    public dialog: MatDialog
  ) {}

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

  updateItem(element: GetColaboradorDTO) {
    const dialogRef = this.dialog.open(UpdateDataDialogComponent, {
      data: { ...element }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const url = environment.backendUrl;
        this.http
        .put(url + `/Colaborador/${result.id}`,
          {
            firstName: result.firstName,
            lastName: result.lastName,
          },
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
