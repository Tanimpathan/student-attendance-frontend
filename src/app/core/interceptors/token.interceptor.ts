import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

