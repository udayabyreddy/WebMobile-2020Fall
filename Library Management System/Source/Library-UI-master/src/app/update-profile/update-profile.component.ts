import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SharedStateService,
  HttpService,
  SnackBarService,
  untilDestroyed,
} from '../@core';
import { Constants, UsersModel } from '../@shared';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  updateProfileForm: FormGroup;
  isError: boolean;
  isLoading = false;
  userDetails: UsersModel;
  constructor(
    public sharedState: SharedStateService,
    public dialogRef: MatDialogRef<UpdateProfileComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  ngOnDestroy(): void {}

  createForm(): void {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.updateProfileForm = this.fb.group({
      firstName: [this.userDetails.firstname, Validators.required],
      password: [this.userDetails.password, Validators.required],
      lastName: [this.userDetails.lastname, Validators.required],
      userName: [{ value: this.userDetails.username, disabled: true }],
      email: [this.userDetails.email, [Validators.required, Validators.email]],
      gender: [this.userDetails.gender, Validators.required],
      address: [this.userDetails.address, Validators.required],
    });
  }
  updateData(): void {
    const result = window.confirm('You will be logged out! Are you sure?');
    if (result) {
      this.sharedState.isLoading.next(true);
      const data = { ...this.updateProfileForm.value };
      const body = {
        username: data.username,
        password: data.password,
        firstname: data.firstName,
        lastname: data.lastName,
        email: data.email,
        gender: data.gender,
        address: data.address,
      };

      const apiUrl = `/user/updateDetails/${this.userDetails._id}`;
      this.httpService
        .putData(apiUrl, body)
        .pipe(untilDestroyed(this))
        .subscribe(
          (res) => {
            this.sharedState.isLoading.next(false);
            if (res) {
              this.snackBarService.openSnackBar('Updated successfully');
              this.dialogRef.close(true);
              sessionStorage.clear();
              this.sharedState.userName.next('');
              this.sharedState.isLogin.next(true);
              this.router.navigate([Constants.routes.homeRoute]);
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
}
