import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MaterialModule } from '../home/material.module';
import { AuthGuard } from './auth.guard';
import { AdminGuard } from './admin-guard';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    LoaderComponent
  ],
  exports: [
    LoaderComponent,
    MaterialModule
  ],
  providers: [AuthGuard, AdminGuard]
})
export class SharedModule { }
