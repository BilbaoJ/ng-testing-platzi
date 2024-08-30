import { Component } from '@angular/core';
import { HighligthDirective } from './highligth.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [HighligthDirective, FormsModule],
  template: `<h5 class="title" highligth>default</h5>
    <h5 highligth="yellow">yellow</h5>
    <p highligth="blue">Parrafo</p>
    <p>Otro parrafo</p>
    <input type="text" [highligth]="color" [(ngModel)]="color">`
})
class HostComponent{
  color = 'pink';
}

describe('HighligthDirective', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent, HighligthDirective]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 highligth elements', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));
    const elementsWithout = fixture.debugElement.queryAll(By.css('*:not([highligth])'));
    expect(elements.length).toEqual(4);
    expect(elementsWithout.length).toEqual(2);
  });

  it('should the elements be match with background color', () => {
    const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));
    expect(elements[0].nativeElement.style.backgroundColor).toEqual('gray');
    expect(elements[1].nativeElement.style.backgroundColor).toEqual('yellow');
    expect(elements[2].nativeElement.style.backgroundColor).toEqual('blue');
    expect(elements.length).toEqual(4);
  });

  it('should the h5.title be default color', () => {
    const titleDebug = fixture.debugElement.query(By.css('.title'));
    const dir = titleDebug.injector.get(HighligthDirective);
    expect(titleDebug.nativeElement.style.backgroundColor).toEqual(dir.defaultColor);
  });

  it('should bind <input> and change the bgColor', () => {
    const inputDebug = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;
    expect(inputElement.style.backgroundColor).toEqual('pink');
    inputElement.value = 'red';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(inputElement.style.backgroundColor).toEqual('red');
    expect(component.color).toEqual('red');
  });
});
