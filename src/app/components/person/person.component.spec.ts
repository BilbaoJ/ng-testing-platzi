import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from '../../models/person.model';

fdescribe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should the name be "Pepito"', () => {
    component.person = new Person('Pepito', 'Perez', 22, 60, 1.70);
    expect(component.person.name).toEqual('Pepito');
  });

  it('should have <p> with "Mi altura es {{person.heigth}}"', () => {
    component.person = new Person('Juan', 'Perez', 22, 58, 1.60);
    const expectMsg = `Mi altura es ${component.person.heigth}`
    const personDebug: DebugElement = fixture.debugElement;
    const pDebug: DebugElement = personDebug.query(By.css('p'));
    const pElement: HTMLElement = pDebug.nativeElement;
    fixture.detectChanges();
    expect(pElement?.textContent).toEqual(expectMsg);
  });

  it('should have <h3> with "Hola, {{person.name}}"', () => {
    component.person = new Person('Juan', 'Perez', 22, 60, 1.70);
    const expectMsg = `Hola, ${component.person.name}`
    const personDebug: DebugElement = fixture.debugElement;
    const h3Debug: DebugElement = personDebug.query(By.css('h3'));
    const h3Element: HTMLElement = h3Debug.nativeElement;
    fixture.detectChanges();
    expect(h3Element?.textContent).toEqual(expectMsg);
  });

  it('should display a text with IMC when call calcIMC', () => {
    component.person = new Person('Juan', 'Perez', 28, 120, 1.60);
    const expectMsg = 'overweigth level 3';
    const bElement = fixture.debugElement.query(By.css('button.btn-imc')).nativeElement;
    component.calcIMC();
    fixture.detectChanges();
    expect(bElement.textContent).toContain(expectMsg);
  });

  it('should display a text with IMC when do clic', () => {
    component.person = new Person('Juan', 'Perez', 28, 120, 1.60);
    const expectMsg = 'overweigth level 3';
    const bDebug = fixture.debugElement.query(By.css('button.btn-imc'));
    const bElement = bDebug.nativeElement;
    bDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(bElement.textContent).toContain(expectMsg);
  });

  it('should raise selected event when do clic', (doneFn) => {
    const expectPerson = new Person('Juan', 'Perez', 28, 120, 1.60);
    component.person = expectPerson;
    const bDebug = fixture.debugElement.query(By.css('button.btn-choose'));
    let selectedPerson: Person | undefined;
    component.onSelected.subscribe(person => {
      selectedPerson = person;
      doneFn();
    });
    bDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(selectedPerson).toEqual(expectPerson);
  });
});
