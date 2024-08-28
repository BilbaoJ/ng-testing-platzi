import { Person } from "./person.model";

describe('Test for Person', () => {
  let person: Person;
  beforeEach(() => {
    person = new Person('Pepito', 'Perez', 22, 70, 1.65);
  })

  it('attrs', () => {
    expect(person.name).toEqual('Pepito');
    expect(person.lastName).toEqual('Perez');
    expect(person.age).toEqual(22);
    expect(person.weigth).toEqual(70);
    expect(person.heigth).toEqual(1.65);
  });

  describe('test for calcIMC', () => {
    it('should return a string: down', () => {
      person.weigth = 40;
      const rta = person.calIMC();
      expect(rta).toEqual('down');
    });

    it('should return a string: normal', () => {
      person.weigth = 58;
      const rta = person.calIMC();
      expect(rta).toEqual('normal');
    });

    it('should return a string: overweigth', () => {
      person.weigth = 70;
      const rta = person.calIMC();
      expect(rta).toEqual('overweigth');
    });

    it('should return a string: overweigth level 1', () => {
      person.weigth = 80;
      const rta = person.calIMC();
      expect(rta).toEqual('overweigth level 1');
    });

    it('should return a string: overweigth level 2', () => {
      person.weigth = 90;
      const rta = person.calIMC();
      expect(rta).toEqual('overweigth level 2');
    });

    it('should return a string: overweigth level 3', () => {
      person.weigth = 120;
      const rta = person.calIMC();
      expect(rta).toEqual('overweigth level 3');
    });

    it('should return a string: not found', () => {
      person.weigth = -40;
      const rta = person.calIMC();
      expect(rta).toEqual('not found');
    });
  });
});
