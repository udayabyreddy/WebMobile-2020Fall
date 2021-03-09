import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { Constants } from '../@shared';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  userSignUp: FormGroup;
  isError: boolean;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService,
    private sharedState: SharedStateService
  ) {
    this.createForm();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  createForm(): void {
    this.userSignUp = this.fb.group({
      firstName: ['', Validators.required],
      password: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  signUp(): void {
    console.log(this.userSignUp.value);
    this.sharedState.isLoading.next(true);
    const data = { ...this.userSignUp.value };
    const url = '/user/signUp';
    const body = {
      username: (data.userName as string).toLowerCase(),
      password: data.password,
      active: true,
      firstname: data.firstName,
      lastname: data.lastName,
      email: (data.email as string).toLowerCase(),
      joined: new Date(),
      gender: data.gender,
      address: data.address,
      booksissued: 0,
    };
    this.httpService
      .postData(url, body)
      .pipe(untilDestroyed(this))
      .subscribe(
        (response) => {
          this.sharedState.isLoading.next(false);
          if (response && response !== false) {
            this.snackBarService.openSnackBar('User added successfully!');
            this.router.navigate([Constants.routes.userLoginRoute]);
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
}
