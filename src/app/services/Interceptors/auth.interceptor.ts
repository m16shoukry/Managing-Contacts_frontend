import { HttpInterceptorFn } from '@angular/common/http';
import { AppConsts } from '../../shared/utils/AppConsts';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenInfo = localStorage.getItem(
    AppConsts.authorization.encrptedAuthTokenName
  );

  let modifiedRequest = request.clone();

  if (tokenInfo) {
    modifiedRequest = modifiedRequest.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenInfo}`,
      },
    });
  }

  return next(modifiedRequest);
};
