import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';
import { PersonComponent } from '../person/person.component';
import { Person } from '../../models/person.model';
import { By } from '@angular/platform-browser';
import { clickEvent, query } from '../../../testing';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleComponent, PersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list app-person components', () => {
    component.people = [
      new Person('Juan', 'Perez', 30, 58, 1.60),
      new Person('Santi', 'Perez', 22, 70, 1.70),
      new Person('Sara', 'Perez', 12, 50, 1.60),
    ];
    fixture.detectChanges();
    const debugElement = fixture.debugElement.queryAll(By.css('app-person'));
    expect(debugElement.length).toEqual(3);
  });

  it('should raise selected event when click', () => {
    clickEvent(fixture, 'btn-choose', true);
    fixture.detectChanges();
    expect(component.selectedPerson).toEqual(component.people[0]);
  });

  it('should render the selected person', () => {
    clickEvent(fixture, 'btn-choose', true);
    fixture.detectChanges();
    const liDebug = query(fixture, '.selected-person ul > li');
    expect(component.selectedPerson).toEqual(component.people[0]);
    expect(liDebug.nativeElement.textContent).toContain(component.selectedPerson?.name);
  });
});
