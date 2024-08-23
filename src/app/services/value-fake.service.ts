export class FakeValueService {

  private value: string = 'my value';

  constructor() { }

  getValue(){
    return 'fake value';
  }

  setValue(value: string){}

  getPromiseValue(){
    return Promise.resolve('fake promise value');
  }
}
