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
});
