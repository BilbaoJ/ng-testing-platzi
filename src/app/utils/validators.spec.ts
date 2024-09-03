import { FormControl, FormGroup } from "@angular/forms";
import { MyValidators } from "./validators";

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
});
