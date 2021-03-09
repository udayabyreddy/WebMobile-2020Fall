import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from 'src/app/@core';
import { SharedStateService } from 'src/app/@core/services/shared-state.services';
import { UsersModel } from 'src/app/@shared';

@Component({
  selector: 'app-find-delete-users',
  templateUrl: './find-delete-users.component.html',
  styleUrls: ['./find-delete-users.component.scss'],
})
export class FindDeleteUsersComponent
  implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['firstName', 'userName', 'email', 'action'];
  dataSource: MatTableDataSource<UsersModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public sharedState: SharedStateService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {
    // Create 100 users
    // const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    // // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.getUsers();
  }
  ngAfterViewInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  ngOnDestroy(): void {}

  getUsers(): void {
    this.sharedState.isLoading.next(true);
    const apiUrl = `/user/`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: UsersModel[]) => {
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

  deleteUser(row: UsersModel): void {
    const result = window.confirm('Warning: This cannot be undone.');
    if (result) {
      this.sharedState.isLoading.next(true);
      const url = `/user/${row._id.toString()}`;
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
