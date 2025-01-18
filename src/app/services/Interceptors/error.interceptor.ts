import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof HttpErrorResponse) {
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else {
          if (error.status === 500 && error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400 && error.error?.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage =
              error.error?.message || `Error ${error.status}: ${error.message}`;
          }
        }
      }

      toastr.error(errorMessage, '', {
        timeOut: 3000,
        positionClass: 'toast-top-center',
      });
      return throwError(() => error);
    })
  );
};
