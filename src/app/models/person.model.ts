export class Person {
  constructor(
    public name: string,
    public lastName: string,
    public age: number,
    public weigth: number,
    public heigth: number,
  ) {}

  calIMC(): string {
    const result = Math.round(this.weigth / (this.heigth * this.heigth));
    if (result >= 40) {
      return 'overweigth level 3';
    } else if (result >= 30) {
      return 'overweigth level 2';
    } else if (result >= 27) {
      return 'overweigth level 1';
    } else if (result >= 25) {
      return 'overweigth';
    } else if (result >= 19) {
      return 'normal';
    } else if (result >= 0) {
      return 'down';
    } else {
      return 'not found'
    }
  }
}
