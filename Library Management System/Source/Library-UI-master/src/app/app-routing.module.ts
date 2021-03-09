import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './@shared';
import { AdminGuard } from './@shared/admin-guard';
import { AdminDashboradComponent } from './admin-dashborad/admin-dashborad.component';
import { UpdateAdminsComponent } from './admin-dashborad/update-admins/update-admins.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { BrowseBooksComponent } from './browse-books/browse-books.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { ReturnRenewComponent } from './return-renew/return-renew.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserLoginComponent } from './user-login/user-login.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'userLogin', component: UserLoginComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'signUp', component: SignUpComponent },
  {
    path: 'dashBoard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'updateAdminDetails', component: UpdateAdminsComponent, canActivate: [AdminGuard], },
  { path: 'returnRenew', component: ReturnRenewComponent, canActivate: [AuthGuard], },
  { path: 'browseBooks', component: BrowseBooksComponent },
  { path: 'adminDashBoard', component: AdminDashboradComponent, canActivate: [AdminGuard], },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
