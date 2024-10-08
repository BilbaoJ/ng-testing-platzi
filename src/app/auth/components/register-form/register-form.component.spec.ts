import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { asyncData, asyncError, clickElement, getText, mockObservable, query, setCheckBoxValue, setinputValue } from '../../../../testing';
import { generateOneUser } from '../../../models/user.mock';
import { Router } from '@angular/router';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    let userServiceSpy = jasmine.createSpyObj('userService', ['create', 'isAvailableByEmail']);
    let routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent, ReactiveFormsModule],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the email field be invalid', () => {
    component.emailField?.setValue('esto no es un correo');
    expect(component.emailField?.invalid).withContext('wrong email').toBeTruthy();

    component.emailField?.setValue('');
    expect(component.emailField?.invalid).withContext('empty email').toBeTruthy();
  });

  it('should the passwod field be invalid', () => {
    component.passwordField?.setValue('');
    expect(component.passwordField?.invalid).withContext('empty').toBeTruthy();

    component.passwordField?.setValue('12345');
    expect(component.passwordField?.invalid).withContext('just 5 caracters').toBeTruthy();

    component.passwordField?.setValue('asdasdsadaa');
    expect(component.passwordField?.invalid).withContext('without numbers').toBeTruthy();

    component.passwordField?.setValue('1asdasdsadaa');
    expect(component.passwordField?.valid).withContext('rigth').toBeTruthy();
  });

  it('should the form be invalid', () => {
    component.form.patchValue({
      name: 'Pepito',
      email: 'pepito@mail.com',
      password: '123456',
      confirmPassword: '123456',
      checkTerms: false
    });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should the email field be invalid from UI', () => {
    const inputDebug = query(fixture, 'input#email');
    const inputElement: HTMLInputElement = inputDebug.nativeElement;
    inputElement.value = 'esto no es un correo';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(component.emailField?.invalid).withContext('wrong email').toBeTruthy();

    const errorText = getText(fixture, 'emailField-email');
    expect(errorText).toContain("It's not a email");
  });

  it('should the email field be invalid from UI with Helper', () => {
    setinputValue(fixture, 'input#email', 'esto no es un correo');
    fixture.detectChanges();
    expect(component.emailField?.invalid).withContext('wrong email').toBeTruthy();

    const errorText = getText(fixture, 'emailField-email');
    expect(errorText).toContain("It's not a email");
  });

  it('should send the form successfully', () => {
    component.form.patchValue({
      name: 'Pepito',
      email: 'pepito@mail.com',
      password: '123456',
      confirmPassword: '123456',
      checkTerms: true
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(mockObservable(mockUser));
    component.register(new Event('submit'));
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  });

  it('should send the form successfully and "loading" => "success"', fakeAsync(() => {
    component.form.patchValue({
      name: 'Pepito',
      email: 'pepito@mail.com',
      password: '123456',
      confirmPassword: '123456',
      checkTerms: true
    });
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));
    component.register(new Event('submit'));
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should send the form successfully demo UI', fakeAsync(() => {
    setinputValue(fixture, 'input#name', 'Pepito');
    setinputValue(fixture, 'input#email', 'pepito@mail.com');
    setinputValue(fixture, 'input#password', '123456');
    setinputValue(fixture, 'input#confirmPassword', '123456');
    setCheckBoxValue(fixture, 'input#terms', true);
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncData(mockUser));
    clickElement(fixture, 'btn-submit', true);
    //query(fixture, 'form').triggerEventHandler('ngSubmit', new Event('submit'));
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toEqual('success');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  }));

  it('should send the form form UI but with error in the service', fakeAsync(() => {
    setinputValue(fixture, 'input#name', 'Pepito');
    setinputValue(fixture, 'input#email', 'pepito@mail.com');
    setinputValue(fixture, 'input#password', '123456');
    setinputValue(fixture, 'input#confirmPassword', '123456');
    setCheckBoxValue(fixture, 'input#terms', true);
    const mockUser = generateOneUser();
    userService.create.and.returnValue(asyncError(mockUser));
    clickElement(fixture, 'btn-submit', true);
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toEqual('error');
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
  }));

  it('should show error with an invalid email', () => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: false}));
    setinputValue(fixture, 'input#email', 'juan@mail.com');
    fixture.detectChanges();
    expect(component.emailField?.invalid).toBeTrue();
    expect(userService.isAvailableByEmail).toHaveBeenCalledWith('juan@mail.com');
    const errorText = getText(fixture, 'emailField-emailTaken');
    expect(errorText).toContain('The email is already registed');
;  });
});
