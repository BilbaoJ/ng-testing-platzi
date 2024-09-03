import { FormControl, FormGroup } from "@angular/forms";
import { MyValidators } from "./validators";
import { UserService } from "../services/user.service";
import { mockObservable } from "../../testing";

fdescribe('Test for MyValidators', () => {
  describe('Test for validPassword', () => {
    it('should return null when password is right', () => {
      const control = new FormControl();
      control.setValue('pepito1234');
      const rta = MyValidators.validPassword(control);
      expect(rta).toBeNull();
    });

    it('should return obj with error when password is wrong', () => {
      const control = new FormControl();
      control.setValue('pepitoperez');
      const rta = MyValidators.validPassword(control);
      expect(rta?.invalid_password).toBeTrue();
    });
  });

  describe('Test for matchPasswords', () => {
    it('should return null', () => {
      const group = new FormGroup({
        password: new FormControl('123456'),
        confirmPassword: new FormControl('123456')
      });
      const rta = MyValidators.matchPasswords(group);
      expect(rta).toBeNull();
    });

    it('should return obj with error', () => {
      const group = new FormGroup({
        password: new FormControl('123456'),
        confirmPassword: new FormControl('1234567')
      });
      const rta = MyValidators.matchPasswords(group);
      expect(rta?.match_password).toBeTrue();
    });

    it('should throw an error', () => {
      const group = new FormGroup({
        other: new FormControl('123456'),
        OtherField: new FormControl('1234567')
      });
      const fn = () => {
        MyValidators.matchPasswords(group);
      }
      expect(fn).toThrow(new Error('matchPasswords: fields not found'));
    });
  });

  describe('Test for validateEmailAsync', () =>{
    it('should return null with valid email', (doneFn) =>{
      const userService: jasmine.SpyObj<UserService> = jasmine.createSpyObj('UserService', ['isAvailableByEmail']);
      const control = new FormControl('pepito@mail.com');
      userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}));
      const validator = MyValidators.validateEmailAsync(userService);
      validator(control).subscribe(rta => {
        expect(rta).toBeNull();
        doneFn();
      });
    });
  });
});
