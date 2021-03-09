import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from 'src/app/@core';
import { SharedStateService } from 'src/app/@core/services/shared-state.services';
import { Constants } from 'src/app/@shared';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.scss'],
})
export class AddAdminComponent implements OnInit, OnDestroy {
  adminForm: FormGroup;
  constructor(
    public sharedState: SharedStateService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService,
    private dialogRef: MatDialogRef<AddAdminComponent>
  ) {}

  ngOnInit(): void {
    this.adminForm = this.fb.group({
      firstName: ['', Validators.required],
      password: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {}

  addAdmin(): void {
    this.sharedState.isLoading.next(true);
    const data = { ...this.adminForm.value };
    const url = '/admin/signUp';
    const body = {
      username: (data.userName as string).toLowerCase(),
      password: data.password,
      active: true,
      firstname: data.firstName,
      lastname: data.lastName,
      email: (data.email as string).toLowerCase(),
      joined: new Date(),
      gender: data.gender,
      address: data.address
    };
    this.httpService
      .postData(url, body)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.sharedState.isLoading.next(false);
          if (response && response !== false) {
            this.dialogRef.close();
            this.snackBarService.openSnackBar('User added successfully!');
          } else {
            this.snackBarService.openSnackBar(
              'Username or email already exists'
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

  resetForm(): void {
    this.adminForm.reset();
  }
}
