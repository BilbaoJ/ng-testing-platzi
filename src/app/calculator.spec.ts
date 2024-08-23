import { Calculator } from "./calculator";

describe('Test for Calculator', () => {
  describe('Tests  for multiply', () => {
    it('#multiply should return the result of the numbers multiplied', () => {
      const calculator = new Calculator();
      const rta = calculator.multiply(3,3);
      expect(rta).toEqual(9);
    });
  });

  describe('Tests  for divide', () => {
    it('#divide should return the result of the numbers divided', () => {
      const calculator = new Calculator();
      const rta = calculator.divide(4,1);
      expect(rta).toEqual(4);
    });

    it('#divide should return null when try divided by 0', () => {
      const calculator = new Calculator();
      const rta = calculator.divide(4,0);
      expect(rta).toEqual(null);
    });
  });

  it('test matchers', () => {
    const name = 'Jessica';
    let name2;
    expect(name).toBeDefined();
    expect(name2).toBeUndefined();
    expect(1 + 3 === 4).toBeTruthy(); // 4
    expect(1 + 1 === 3).toBeFalsy();
    expect(5).toBeLessThan(10);
    expect(20).toBeGreaterThan(10);
    expect('123456').toMatch(/123/);
    expect(['apples', 'oranges', 'bananas']).toContain('oranges');
  });
});
