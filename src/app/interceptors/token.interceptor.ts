import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    let request = addToken(req);
    return next(request);
};

const addToken = (req: HttpRequest<unknown>) => {
  const tokenService: TokenService = inject(TokenService);
  const accessToken: string | null = tokenService.getToken();
  if (accessToken) {
    const authRequest: HttpRequest<any> = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
    });
    return authRequest;
  }
  return req;
}
