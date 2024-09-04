import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const tokenService: TokenService = inject(TokenService);
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  route.params['idProduct'];
  route.data['idProduct'];
  route.paramMap.get('idProduct');
  route.paramMap.has('idProduct');
  return authService.getUser().pipe(map(user => {
    if (!user) {
      router.navigate(['/home']);
      return false;
    }
    return true;
  }));
};
