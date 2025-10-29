// error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, router, toastr);
      return throwError(() => error);
    })
  );
};

function handleError(error: HttpErrorResponse, router: Router, toastr: ToastrService): void {
  let errorMessage = 'An unexpected error occurred';

  switch (error.status) {
    case 0:
      errorMessage = 'Network error. Please check your internet connection.';
      break;

    case 401:
      errorMessage = 'Session expired. Please login again.';
      localStorage.removeItem('token');
      router.navigate(['/login']);
      break;

    case 403:
      errorMessage = 'You do not have permission to perform this action.';
      break;

    case 404:
      errorMessage = 'The requested resource was not found.';
      break;

    case 500:
    case 502:
    case 503:
      errorMessage = 'Server error. Please try again later.';
      break;

    case 400:
      errorMessage = error.error?.message || 'Invalid request. Please check your input.';
      break;

    default:
      errorMessage = error.error?.message || error.message || errorMessage;
  }

  toastr.error(errorMessage, 'Error', {
    timeOut: 5000,
    closeButton: true,
  });

  console.error('HTTP Error:', error);
}
