import { Component } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "roma" to "amor"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('roma')
    expect(rta).toEqual('amor');
  });

  it('should transform "123" to "321"', () => {
    const pipe = new ReversePipe();
    const rta = pipe.transform('123')
    expect(rta).toEqual('321');
  });
});

@Component({
  standalone: true,
  imports: [ReversePipe, FormsModule],
  template: `<h5>{{ 'roma' | reverse }}</h5>
    <input type="text" [(ngModel)]="text">
    <p>{{ text | reverse }}</p>`
})
class HostComponent{
  text = '';
}

describe('Reversepipe from HostComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should <h5> be "amor"', () => {
    const h5Debug = fixture.debugElement.query(By.css('h5'));
    expect(h5Debug.nativeElement.textContent).toEqual('amor');
  });

  it('should apply reverse pipe when typing in the input', () => {
    const inputDebug = fixture.debugElement.query(By.css('input'));
    const inputElement: HTMLInputElement = inputDebug.nativeElement;
    const pDebug = fixture.debugElement.query(By.css('p'));
    expect(pDebug.nativeElement.textContent).toEqual('');
    inputElement.value = 'rosa';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(pDebug.nativeElement.textContent).toEqual('asor');
  });
});
