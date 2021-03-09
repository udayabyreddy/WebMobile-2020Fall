import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { BooksModel, Constants } from '../@shared';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddBookComponent } from './add-book/add-book.component';
import { FindDeleteUsersComponent } from './find-delete-users/find-delete-users.component';
import { UpdateBooksComponent } from './update-books/update-books.component';

@Component({
  selector: 'app-admin-dashborad',
  templateUrl: './admin-dashborad.component.html',
  styleUrls: ['./admin-dashborad.component.scss'],
})
export class AdminDashboradComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['ISBN', 'booktitle', 'action'];
  dataSource: MatTableDataSource<BooksModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public sharedState: SharedStateService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getBooks();
  }
  ngOnDestroy(): void {}

  addAdmin(): void {
    this.dialog.open(AddAdminComponent, { disableClose: true });
  }
  addBook(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.getBooks();
        }
      });
  }
  confgiureUsers(): void {
    this.dialog.open(FindDeleteUsersComponent, { disableClose: true });
  }
  updateAdminDetails(): void {
    this.router.navigate([Constants.routes.updateAdminDetails]);
  }
  getBooks(): void {
    this.sharedState.isLoading.next(true);
    const apiUrl = `/books`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: BooksModel[]) => {
          this.sharedState.isLoading.next(false);
          if (data) {
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        (err) => {
          this.sharedState.isLoading.next(false);
          console.error(err);
          this.snackBarService.openSnackBar('Error while users!');
        }
      );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateBook(row: BooksModel): void {
    const dialogRef = this.dialog.open(UpdateBooksComponent, {
      data: row,
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result) {
          this.getBooks();
        }
      });
  }
  deleteBook(row: BooksModel): void {
    const result = window.confirm('Warning: This cannot be undone.');
    if (result) {
      this.sharedState.isLoading.next(true);
      const url = `/books/${row._id.toString()}`;
      this.httpService
        .deleteData(url)
        .pipe(untilDestroyed(this))
        .subscribe(
          (response) => {
            this.sharedState.isLoading.next(false);
            if (response && response !== false) {
              this.snackBarService.openSnackBar('Book Deleted successfully!');
              this.getBooks();
            } else {
              this.snackBarService.openSnackBar(
                'Unable to delete Book!...Please try again'
              );
            }
          },
          (err) => {
            this.sharedState.isLoading.next(false);
            console.log(err);
            this.snackBarService.openSnackBar('Error.Contact Admin!');
          }
        );
    }
  }
}
