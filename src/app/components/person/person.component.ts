import { Component, Input } from '@angular/core';
import { Person } from '../../models/person.model';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [],
  templateUrl: './person.component.html',
  styleUrl: './person.component.scss'
})
export class PersonComponent {

  @Input() person: Person = new Person('', '', 0, 0, 0);
  imc: string = '';

  calcIMC(){
    this.imc = this.person.calIMC();
  }

}
