import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService, SnackBarService, untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { Constants } from '../@shared';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit, OnDestroy {
  adminForm: FormGroup;
  isError: boolean;
  isLoading = false;

  constructor(
    public sharedState: SharedStateService,
    private fb: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}
  createForm(): void {
    this.adminForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    this.sharedState.isLoading.next(true);
    const apiUrl =
      `/admin/login` +
      `?username=${this.adminForm.value.username}&password=${this.adminForm.value.password}`;
    this.httpService
      .getData(apiUrl)
      .pipe(untilDestroyed(this))
      .subscribe(
        (data: any) => {
          this.sharedState.isLoading.next(false);
          if (data && data !== false) {
            const userDetails = JSON.stringify(data);
            sessionStorage.setItem('userDetails', userDetails);
            sessionStorage.setItem('isAdmin', JSON.stringify(true));
            this.snackBarService.openSnackBar('Login successful');
            setTimeout(() => {
              this.router.navigate([Constants.routes.adminDashBoard]);
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
