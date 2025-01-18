import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, ReactiveFormsModule, ToastrModule, RouterModule],
  exports: [],
})
export class AccountModule {}
