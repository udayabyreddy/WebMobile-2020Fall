import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  SharedStateService,
  HttpService,
  SnackBarService,
  untilDestroyed,
} from 'src/app/@core';
import { AdminModel, Constants } from 'src/app/@shared';
import { UpdatePopupComponent } from './update-popup/update-popup.component';

@Component({
  selector: 'app-update-admins',
  templateUrl: './update-admins.component.html',
  styleUrls: ['./update-admins.component.scss'],
})
export class UpdateAdminsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['firstName', 'userName', 'email', 'action'];
  dataSource: MatTableDataSource<AdminModel>;

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
    this.getUsers();
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}

  getUsers(): void {
    this.sharedState.isLoading.next(true);
    const apiUrl = `/admin`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: AdminModel[]) => {
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

  updateAdmin(row: AdminModel): void {
    const dialogRef = this.dialog.open(UpdatePopupComponent, {
      data: row,
      disableClose: true,
    });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe((result) => {
      if (result) {
        this.getUsers();
      }
    });
  }

  backToDashBoard(): void {
    this.router.navigate([Constants.routes.adminDashBoard]);
  }

  deleteAdmin(row: AdminModel): void {
    const result = window.confirm('Warning: This cannot be undone.');
    if (result) {
      this.sharedState.isLoading.next(true);
      const url = `/admin/${row._id.toString()}`;
      this.httpService
        .deleteData(url)
        .pipe(untilDestroyed(this))
        .subscribe(
          (response) => {
            this.sharedState.isLoading.next(false);
            if (response && response !== false) {
              this.snackBarService.openSnackBar('User Deleted successfully!');
              this.getUsers();
            } else {
              this.snackBarService.openSnackBar(
                'Unable to delete user!...Please try again'
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
