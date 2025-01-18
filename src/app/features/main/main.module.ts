import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    RouterModule,
    BsDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    ToastrModule,
    NgxPaginationModule,
  ],
})
export class MainModule {}
