import { Component } from '@angular/core';
import { PersonComponent } from '../person/person.component';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-people',
  standalone: true,
  imports: [PersonComponent],
  templateUrl: './people.component.html',
  styleUrl: './people.component.scss'
})
export class PeopleComponent {

  person: Person = new Person('Pepito', 'Perez', 22, 58, 1.60);
  people: Person[] = [
    new Person('Juan', 'Perez', 30, 58, 1.60),
    new Person('Santi', 'Perez', 22, 70, 1.70),
  ];
  selectedPerson: Person | null = null;

  choose(person: Person){
    this.selectedPerson = person;
  }

}
