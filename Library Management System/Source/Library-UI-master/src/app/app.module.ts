import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { SharedModule } from './@shared';
import { CoreModule } from './@core';
import { SignUpComponent } from './sign-up/sign-up.component';
import { BrowseBooksComponent } from './browse-books/browse-books.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookDetailsComponent } from './browse-books/book-details/book-details.component';
import { AdminDashboradComponent } from './admin-dashborad/admin-dashborad.component';
import { AddAdminComponent } from './admin-dashborad/add-admin/add-admin.component';
import { AddBookComponent } from './admin-dashborad/add-book/add-book.component';
import { FindDeleteUsersComponent } from './admin-dashborad/find-delete-users/find-delete-users.component';
import { UpdateAdminsComponent } from './admin-dashborad/update-admins/update-admins.component';
import { UpdatePopupComponent } from './admin-dashborad/update-admins/update-popup/update-popup.component';
import { UpdateBooksComponent } from './admin-dashborad/update-books/update-books.component';
import { ReturnRenewComponent } from './return-renew/return-renew.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserLoginComponent,
    AdminLoginComponent,
    SignUpComponent,
    BrowseBooksComponent,
    DashboardComponent,
    BookDetailsComponent,
    AdminDashboradComponent,
    AddAdminComponent,
    AddBookComponent,
    FindDeleteUsersComponent,
    UpdateAdminsComponent,
    UpdatePopupComponent,
    UpdateBooksComponent,
    ReturnRenewComponent,
    UpdateProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
