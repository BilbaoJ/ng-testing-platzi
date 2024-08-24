import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('tests for login', () => {
    it('should return a token', (doneFn) => {
      const mockData: Auth = {
        access_token: '121324'
      };
      const email = 'jess@gmail.com';
      const password = '123';
      authService.login(email, password)
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });

    it('should call to saveToken', (doneFn) => {
      const mockData: Auth = {
        access_token: '121324'
      };
      const email = 'jess@gmail.com';
      const password = '123';
      spyOn(tokenService, 'saveToken').and.callThrough();
      authService.login(email, password)
      .subscribe((data) => {
        expect(data).toEqual(mockData);
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledOnceWith('121324');
        doneFn();
      })

      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
    });
  });
});
