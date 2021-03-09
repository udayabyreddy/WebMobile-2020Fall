import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedStateService } from './@core/services/shared-state.services';
import { Constants } from './@shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'library-ui';

  constructor(public sharedState: SharedStateService, private router: Router) {}
  ngOnInit(): void {
    const userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    if (userDetails) {
      this.sharedState.userName.next(userDetails.firstname);
      this.sharedState.isLogin.next(false);
    }
  }

  logOut(): void {
    this.router.navigate([Constants.routes.homeRoute]);
    sessionStorage.clear();
    this.sharedState.userName.next('');
    this.sharedState.isLogin.next(true);
  }

  redirectToDashBoard(): void {
    this.router.navigate([Constants.routes.dashBoardRoute]);
  }

  redirectToHome(): void {
    this.router.navigate([Constants.routes.homeRoute]);
  }
}
