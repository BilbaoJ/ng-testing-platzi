import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponent } from './person.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from '../../models/person.model';
import { getText, query } from '../../../testing';

describe('PersonComponent', () => {
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
    fixture.detectChanges();
    const text = getText(fixture, 'person-heigth');
    expect(text).toContain(expectMsg);
  });

  it('should have <h3> with "Hola, {{person.name}}"', () => {
    component.person = new Person('Juan', 'Perez', 22, 60, 1.70);
    const expectMsg = `Hola, ${component.person.name}`
    fixture.detectChanges();
    const text = getText(fixture, 'person-name');
    expect(text).toContain(expectMsg);
  });

  it('should display a text with IMC when call calcIMC', () => {
    component.person = new Person('Juan', 'Perez', 28, 120, 1.60);
    const expectMsg = 'overweigth level 3';
    component.calcIMC();
    fixture.detectChanges();
    const text = getText(fixture, 'btn-imc');
    expect(text).toContain(expectMsg);
  });

  it('should display a text with IMC when do clic', () => {
    component.person = new Person('Juan', 'Perez', 28, 120, 1.60);
    const expectMsg = 'overweigth level 3';
    const bDebug = query(fixture, 'button.btn-imc');
    bDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    const text = getText(fixture, 'btn-imc');
    expect(text).toContain(expectMsg);
  });

  it('should raise selected event when do clic', (doneFn) => {
    const expectPerson = new Person('Juan', 'Perez', 28, 120, 1.60);
    component.person = expectPerson;
    const bDebug = query(fixture, 'button.btn-choose');
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

@Component({
  standalone: true,
  imports: [PersonComponent],
  template: `<app-person [person]="person" (onSelected)="onSelected($event)"></app-person>`
})
class HostComponent{
  person = new Person('Santi', 'Perez', 18, 70, 1.68);
  selectedPerson: Person | undefined;

  onSelected(person: Person){
    this.selectedPerson = person;
  }
}

describe('PersonComponent form HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, PersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display person name', () => {
    const expectName = component.person.name;
    fixture.detectChanges();
    const text = getText(fixture, 'person-name');
    expect(text).toContain(expectName);
  });

  it('should raise selected event when clicked', () => {
    const btnDebug = query(fixture, 'app-person .btn-choose');
    btnDebug.triggerEventHandler('click', null);
    fixture.detectChanges()
    expect(component.selectedPerson).toEqual(component.person);
  });
});
