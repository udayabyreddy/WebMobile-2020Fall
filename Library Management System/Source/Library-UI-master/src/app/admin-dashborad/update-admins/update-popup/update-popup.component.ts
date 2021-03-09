import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  SharedStateService,
  HttpService,
  SnackBarService,
  untilDestroyed,
} from 'src/app/@core';
import { AdminModel } from 'src/app/@shared';

@Component({
  selector: 'app-update-popup',
  templateUrl: './update-popup.component.html',
  styleUrls: ['./update-popup.component.scss'],
})
export class UpdatePopupComponent implements OnInit, AfterViewInit, OnDestroy {
  adminForm: FormGroup;

  constructor(
    public sharedState: SharedStateService,
    public dialogRef: MatDialogRef<UpdatePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdminModel,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      firstName: [this.data.firstname, Validators.required],
      password: [this.data.password, Validators.required],
      lastName: [this.data.lastname, Validators.required],
      userName: [this.data.username, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      gender: [this.data.gender, Validators.required],
      address: [this.data.address, Validators.required],
    });
  }
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
  resetForm(): void {
    this.adminForm.reset();
  }

  updateAdmin(): void {
    this.sharedState.isLoading.next(true);
    const data = { ...this.adminForm.value };
    const body = {
      username: this.data.username,
      password: data.password,
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      joined: this.data.joined,
      gender: data.gender,
      address: data.address,
    };

    const apiUrl = `/admin/${this.data._id}`;
    this.httpService
      .putData(apiUrl, body)
      .pipe(untilDestroyed(this))
      .subscribe(
        (res) => {
          this.sharedState.isLoading.next(false);
          if (res) {
            this.snackBarService.openSnackBar('Updated successfully');
            this.dialogRef.close(true);
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
