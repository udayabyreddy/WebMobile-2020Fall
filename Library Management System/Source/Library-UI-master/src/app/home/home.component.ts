import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from '../@core';
import { SharedStateService } from '../@core/services/shared-state.services';
import { Constants } from '../@shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  disbleButtons = false;
  isAdminUser = false;

  constructor(public sharedState: SharedStateService, private router: Router) {}
  routes = Constants.routes;
  ngOnInit(): void {
    this.observerDisableButtons();
    this.setAdminUser();
  }

  ngOnDestroy(): void {}

  setAdminUser(): void {
    this.sharedState.isLogin.pipe(untilDestroyed(this)).subscribe(() => {
      if (JSON.parse(sessionStorage.getItem('isAdmin'))) {
        this.isAdminUser = true;
      } else {
        this.isAdminUser = false;
      }
    });
  }

  observerDisableButtons(): void {
    this.sharedState.userName.pipe(untilDestroyed(this)).subscribe((value) => {
      if (value) {
        this.disbleButtons = true;
      } else {
        this.disbleButtons = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
