import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { Constants } from '../@shared/constants/constants';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
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
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.sharedState.isLoading.next(true);
    const apiUrl =
      Constants.checkLogin +
      `?username=${this.loginForm.value.username}&password=${this.loginForm.value.password}`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: any) => {
          this.sharedState.isLoading.next(false);
          if (data && data !== false) {
            const userDetails = JSON.stringify(data);
            sessionStorage.setItem('userDetails', userDetails);
            sessionStorage.setItem('isUserLoggedIn', JSON.stringify(true));
            this.snackBarService.openSnackBar('Login successful');
            setTimeout(() => {
              this.router.navigate([Constants.routes.dashBoardRoute]);
              this.sharedState.isLogin.next(false);
              this.sharedState.userName.next(data.firstname);
            }, 300);
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
}
