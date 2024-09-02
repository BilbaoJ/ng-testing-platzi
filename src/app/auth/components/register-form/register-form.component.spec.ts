import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { getText, mockObservable, query, setinputValue } from '../../../../testing';
import { generateOneUser } from '../../../models/user.mock';

fdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    let userServiceSpy = jasmine.createSpyObj('userService', ['create']);
    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent, ReactiveFormsModule],
      providers: [
        {provide: UserService, useValue: userServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
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
});
