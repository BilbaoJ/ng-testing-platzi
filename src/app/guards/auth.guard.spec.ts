import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { fakeActivatedRouteSnapshot, fakeRouterStateSnapshot } from '../../testing/snapshot';
import { mockObservable } from '../../testing';
import { generateOneUser } from '../models/user.mock';
import { Observable } from 'rxjs';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true with session', (doneFn) => {
    const activateRoute = fakeActivatedRouteSnapshot({});
    const routerState = fakeRouterStateSnapshot({});
    const userMock = generateOneUser();
    authService.getUser.and.returnValue(mockObservable(userMock));
    const result = executeGuard(activateRoute, routerState) as Observable<boolean>;
    result.subscribe(rta => {
      expect(rta).toBeTrue();
      doneFn();
    });
  });

  it('should return false without session', (doneFn) => {
    const activateRoute = fakeActivatedRouteSnapshot({});
    const routerState = fakeRouterStateSnapshot({});
    authService.getUser.and.returnValue(mockObservable(null));
    const result = executeGuard(activateRoute, routerState) as Observable<boolean>;
    result.subscribe(rta => {
      expect(rta).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
      doneFn();
    });
  });
});
