import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor(private toastr: ToastrService) {}

  handle(error: any): void {
    let errorMessage: string = '';

    if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unexpected error occurred.';
    }

    this.toastr.error(errorMessage, '', {
      timeOut: 5000,
      positionClass: 'toast-top-center',
      closeButton: true,
    });
  }
}
