import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  SharedStateService,
  HttpService,
  SnackBarService,
  untilDestroyed,
} from '../@core';
import { BooksModel } from '../@shared';

@Component({
  selector: 'app-return-renew',
  templateUrl: './return-renew.component.html',
  styleUrls: ['./return-renew.component.scss'],
})
export class ReturnRenewComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'booktittle',
    'issuedate',
    'returndate',
    'action',
  ];
  dataSource: MatTableDataSource<BooksModel>;
  constructor(
    public sharedState: SharedStateService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getReturnDetails();
  }
  ngOnDestroy(): void {}
  getReturnDetails(): void {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.sharedState.isLoading.next(true);
    const apiUrl = `/books/getReturns?id=${userDetails._id}`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: any) => {
          this.sharedState.isLoading.next(false);
          if (data && data !== false) {
            this.dataSource = new MatTableDataSource(data);
          } else {
            this.snackBarService.openSnackBar('Login failed!!!');
          }
        },
        (error) => {
          this.snackBarService.openSnackBar('Login failed!!!');
          this.sharedState.isLoading.next(false);
          console.log(error);
        }
      );
  }

  renew(element: BooksModel): void {
    this.sharedState.isLoading.next(true);
    const apiUrl = `/books/renew/${element._id}`;
    this.httpService
      .putData(apiUrl, element)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.sharedState.isLoading.next(false);
          if (res) {
            this.snackBarService.openSnackBar('Renewed successfully');
            this.getReturnDetails();
          } else {
            this.snackBarService.openSnackBar(
              'Some thing went wrong....Try again'
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

  return(element: BooksModel): void {
    this.sharedState.isLoading.next(true);

    const apiUrl = `/books/return/${element._id}`;
    this.httpService
      .putData(apiUrl, element)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.sharedState.isLoading.next(false);
          if (res) {
            this.snackBarService.openSnackBar('Returned successfully');
            this.getReturnDetails();
          } else {
            this.snackBarService.openSnackBar(
              'Some thing went wrong....Try again'
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
