import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { SharedStateService } from '../@core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private sharedState: SharedStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (JSON.parse(sessionStorage.getItem('isAdmin'))) {
      // logged in so return true
      return true;
    }
    // not logged in so redirect to login page with the return url
    sessionStorage.clear();
    this.sharedState.userName.next('');
    this.sharedState.isLogin.next(true);
    this.router.navigate(['/home']);
    return false;
  }
}
