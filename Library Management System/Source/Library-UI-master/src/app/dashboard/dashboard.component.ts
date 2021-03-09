import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { Constants, UsersModel } from '../@shared';
import { LogsModel } from '../@shared/models/logs.model';
import { UpdateProfileComponent } from '../update-profile/update-profile.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  routes = Constants.routes;
  userDetails: UsersModel;
  displayedColumns: string[] = ['info', 'category', 'date'];
  dataSource: MatTableDataSource<LogsModel>;
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
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.getLogs();
  }
  ngOnDestroy(): void {}
  redirectTo(url: string): void {
    this.router.navigate([url]);
  }

  updateProfile(): void {
    this.dialog.open(UpdateProfileComponent, { disableClose: true });
  }

  getLogs(): void {
    if (this.userDetails) {
      this.sharedState.isLoading.next(true);
      const api = `/books/getLogs?id=${this.userDetails._id}`;
      this.httpService
        .getData(api)
        .pipe(untilDestroyed(this))
        .subscribe(
          (data: LogsModel[]) => {
            this.sharedState.isLoading.next(false);
            this.dataSource = new MatTableDataSource(data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          },
          (err) => {
            this.sharedState.isLoading.next(false);
            console.error(err);
            this.snackBarService.openSnackBar(
              'Error while searching!!Contact Admin'
            );
          }
        );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProfile(): void {
    const res = window.confirm('This action cannot be undone! Are you sure?');
    if (res) {
      const confirmation = window.confirm('You will be logged out!');
      if (confirmation) {
        this.deleteUser();
      }
    }
  }

  deleteUser(): void {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (userDetails) {
      this.sharedState.isLoading.next(true);
      const url = `/user/${userDetails._id.toString()}`;
      this.httpService
        .deleteData(url)
        .pipe(untilDestroyed(this))
        .subscribe(
          (response) => {
            this.sharedState.isLoading.next(false);
            if (response && response !== false) {
              this.snackBarService.openSnackBar('User Deleted successfully!');
              sessionStorage.clear();
              this.router.navigate([Constants.routes.homeRoute]);
              this.sharedState.userName.next('');
              this.sharedState.isLogin.next(true);
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
